import { Router } from 'express';
import { generarRespuestaIA } from '../controllers/aiController.js';

const router = Router();

router.post('/mensaje', async (req, res) => {
  const mensajeUsuario = req.body.mensaje;
  try {
    const respuesta = await generarRespuestaIA(mensajeUsuario);
    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
