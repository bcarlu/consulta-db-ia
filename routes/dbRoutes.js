import { Router } from 'express';
import { crearNuevaDB, listarPersonas } from '../controllers/dbController.js';

const router = Router();

router.get('/crear-nueva-db', crearNuevaDB);
router.get('/personas', listarPersonas);

export default router;
