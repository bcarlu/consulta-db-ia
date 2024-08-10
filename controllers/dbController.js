import { conexion } from '../index.js';

export const crearNuevaDB = async (req, res) => {
  const crearBaseDeDatos = 'CREATE DATABASE IF NOT EXISTS hm_ia_db CHARACTER SET utf8 COLLATE utf8_spanish_ci;';
  const usarBaseDeDatos = 'USE hm_ia_db;';
  const crearTabla = `
    CREATE TABLE IF NOT EXISTS personas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        frase TEXT NOT NULL
    );
  `;
  const insertarDatos = `
    INSERT INTO personas (nombre, frase) VALUES
        ('Juan Perez', 'La vida es bella.'),
        ('Maria Gomez', 'El conocimiento es poder.'),
        ('Carlos Lopez', 'El tiempo es oro.');
  `;

  try {
    await conexion.query(crearBaseDeDatos);
    await conexion.query(usarBaseDeDatos);
    await conexion.query(crearTabla);
    await conexion.query(insertarDatos);

    res.send('Base de datos y tabla creadas con éxito, y datos insertados.');
  } catch (err) {
    console.error('Error en el proceso:', err);
    res.status(500).send('Error al realizar las operaciones en la base de datos.');
  }
};

export const listarPersonas = async (req, res) => {
  const obtenerPersonas = `SELECT * FROM personas;`;

  try {
    await conexion.query('USE hm_ia_db;');
    const [resultados] = await conexion.query(obtenerPersonas);
    res.json(resultados);
  } catch (err) {
    console.error('Error en el proceso:', err);
    res.status(500).send('Error al realizar las operaciones en la base de datos.');
  }
};
