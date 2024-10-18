
# Proyecto API de Asistente de IA y Base de Datos

Este proyecto es una API que permite interactuar con una base de datos y un asistente de IA. La API permite hacer pruebas enviando preguntas al asistente de IA de OpenAI y obtener una respuesta con la informacion de la base de datos. Para ello debes tener una cuenta de pago en OpenaAI y debes crear el asistente el cual debe tener configurada la herramienta de funciones en la cual debe estar configurada la funcion "consultarBaseDeDatos" con la siguiente estructura:

```json
{
  "name": "consultarBaseDeDatos",
  "description": "Esta funcion se encarga de consultar la base de datos para obtener la informacion solicitada por el usuario",
  "strict": false,
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Consulta SQL que se utilizara para obtener la informacion de la base de datos, se envia como parametro, pero no se le pregunta al usuario, sino que es deducida por el asistente basado en la pregunta del cliente y el esquema de la base de datos suministrado."
      }
    },
    "required": [
      "query"
    ]
  }
}
```
Y en las instrucciones del asistente agregar el esquema de la base de datos, por ejemplo:

```plaintext
Para responder las preguntas de los usuarios debes realizar  consultas a la base de datos de la empresa. Para ello debes llamar la la función `consultarBaseDeDatos(query)` y en el parametro 'query' debes enviar la consulta SQL que se debe ejecutar. Luego de que recibas la informacion de la base de datos, asegúrate de que la información proporcionada al cliente sea clara y precisa. Para enviar la consulta SQL te debes apoyar en el siguiente esquema:

[
    "CREATE TABLE personas (\n  id int NOT NULL AUTO_INCREMENT,\n  nombre varchar(255) COLLATE utf8mb3_spanish_ci NOT NULL,\n  frase text COLLATE utf8mb3_spanish_ci NOT NULL,\n  PRIMARY KEY (id)\n) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci"
]

Aquí tienes algunos ejemplos de preguntas y cómo deberían ser respondidas:

1. **Pregunta del cliente**: "¿Cuántas personas hay en la empresa?"
   - **Consulta SQL**: `SELECT COUNT(*) FROM personas;`
   - **Respuesta esperada**: "Actualmente, hay [número] personas en la empresa."

2. **Pregunta del cliente**: "¿Cuál es la frase de María?"
   - **Consulta SQL**: `SELECT nombre, frase FROM personas WHERE nombre LIKE 'María%';`
   - **Respuesta esperada**: "Las frases de las personas llamadas María son:\n- [nombre]: [frase]\n- [nombre]: [frase]"

#### Formato del prompt:
1. **Pregunta del cliente**: [Pregunta del cliente]
   - **Consulta SQL**: [Consulta SQL]
   - **Respuesta esperada**: [Respuesta esperada]

### Ejemplo de ejecución:

Pregunta del cliente: "¿Cuántas personas hay en la empresa?"
Consulta SQL: `SELECT COUNT(*) FROM personas;`
Respuesta esperada: "Actualmente, hay [número] personas en la empresa."

Pregunta del cliente: "¿Cuál es la frase de María?"
Consulta SQL: `SELECT nombre, frase FROM personas WHERE nombre LIKE 'María%';`
Respuesta esperada: "Las frases de las personas llamadas María son:\n- [nombre]: [frase]\n- [nombre]: [frase]"

```

## Requisitos

- Node.js v14 o superior
- MySQL
- Una cuenta y clave API de OpenAI

## Instalación

1. **Clona este repositorio**:

   ```bash
   git clone https://github.com/bcarlu/consulta-db-ia
   cd consulta-db-ia
   ```

2. **Instala las dependencias**:

   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:

   Crea un archivo `.env` en la raíz del proyecto con las variables de entorno, ejemplo:

   ```plaintext
   MYSQLDB_HOST=localhost
   MYSQLDB_ROOT_PASSWORD=tu_contraseña_mysql
   DB_NAME=hm_ia_db
   OPENAI_API_KEY=tu_clave_api_openai
   ID_ASSISTANT=tu_id_asistente_openai
   ```

4. **Levantar los servicios usando Docker Compose:**:

   ```bash
   docker-compose up
   ```
5. **Si no deseas utilizas docker debes lanzar el servidor y tener configurado mysql localmente**:

   ```bash
   nodemon index.js
   ```

El servidor estará disponible en `http://localhost:3000`.

## Endpoints

### 1. Base de Datos

- **GET `/crear-nueva-db`**: Crea la base de datos, una tabla y llena esta con datos de ejemplo.
  
- **GET `/personas`**: Lista todas las personas de la base de datos. Esto sirve para ver la informacion almacenada y comprobar que la respuesta del asistente sea correcta.

### 2. Asistente de IA

- **POST `/mensaje`**: Recibe la pregunta del usuario y lo envía un mensaje al asistente de IA, el cual dependiendo de la pregunta llama a la funcion "consultarBaseDeDatos" y segun el resultado envia de el resultado de la respuesta. El cuerpo de la solicitud debe ser un JSON con el campo `mensaje`.

  Ejemplo de solicitud:

  ```json
  {
    "mensaje": "¿Cuál es la frase de Maria?"
  }
  ```

