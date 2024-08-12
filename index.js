import express from 'express';
import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import dbRoutes from './routes/dbRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import ngrok from '@ngrok/ngrok'

config();

const app = express();
const port = 3000;

app.use(express.json());

export const conexion = await mysql.createConnection({
  host: process.env.MYSQLDB_HOST,
  user: process.env.DB_USER || 'root',
  password: process.env.MYSQLDB_ROOT_PASSWORD,
  database: process.env.DB_NAME || 'hm_ia_db'
});

app.get("/", (req, res) => {
  res.json({"Mensaje":"Hola mundo IA"})
})
app.use('/', dbRoutes);
app.use('/', aiRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Conexion a Ngrok. Descomentar para publicar el servidor local y acceder desde internet.
//ngrok.connect({ addr: 3000, authtoken_from_env: true })
//	.then(listener => console.log(`Ingress established at: ${listener.url()}`));