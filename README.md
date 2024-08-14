
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

## Requisitos

- Node.js v14 o superior
- MySQL
- Una cuenta y clave API de OpenAI

## Instalación

1. **Clona este repositorio**:

   ```bash
   git clone https://github.com/bcarlu/hola-mundo-ia
   cd hola-mundo-ia
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
   docker-compose up -d
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

