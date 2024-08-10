import OpenAI from "openai";
import { conexion } from '../index.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const idAsistente = process.env.ID_ASSISTANT;

export const consultarBaseDeDatos = async (query) => {
  const [resultado] = await conexion.query(query);
  return resultado;
};

export const generarRespuestaIA = async (mensajeUsuario) => {
  console.log("Mensaje del usuario:", mensajeUsuario);

  try {
    // Crear un nuevo hilo (thread)
    const thread = await openai.beta.threads.create();

    // Enviar el mensaje del usuario al asistente
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: mensajeUsuario,
    });

    // Iniciar una ejecución (run)
    let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: idAsistente,
    });

    // Manejar la acción requerida
    const handleRequiresAction = async (run) => {
      if (
        run.required_action &&
        run.required_action.submit_tool_outputs &&
        run.required_action.submit_tool_outputs.tool_calls
      ) {
        const toolOutputs = await Promise.all(
          run.required_action.submit_tool_outputs.tool_calls.map(async (tool) => {
            if (tool.function.name === "consultarBaseDeDatos") {
              const args = JSON.parse(tool.function.arguments); // Asegúrate de que los argumentos estén en formato JSON
              const query = args.query;

              if (query) {
                console.log('Parametros enviados por el asistente:', query);
                
                const resultado = await consultarBaseDeDatos(query);
                
                console.log("Resultado consulta dentro de run:", resultado);
                return {
                  tool_call_id: tool.id,
                  output: JSON.stringify(resultado),
                };
              } else {
                console.error('Query no está definida en los argumentos enviados por el asistente.');
              }
            }
          })
        );

        if (toolOutputs.length > 0) {
          run = await openai.beta.threads.runs.submitToolOutputsAndPoll(thread.id, run.id, { tool_outputs: toolOutputs });
          console.log("Tool outputs submitted successfully.");
        } else {
          console.log("No tool outputs to submit.");
        }

        return handleRunStatus(run);
      }
    };

    const handleRunStatus = async (run) => {
      if (run.status === "completed") {
        const messages = await openai.beta.threads.messages.list(thread.id);
        console.log(messages.data);
        return { respuesta: messages.data };
      } else if (run.status === "requires_action") {
        console.log("Ejecutando acciones requeridas:", run.status);
        return await handleRequiresAction(run);
      } else {
        console.error("Run no se completo:", run);
      }
    };

    return await handleRunStatus(run);
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Ocurrió un error al procesar la consulta");
  }
};