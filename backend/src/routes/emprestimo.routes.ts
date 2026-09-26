import { Router } from 'express';
import { emprestimoController } from '../controllers/EmprestimoController.js';

const router = Router();

router.post('/', (req, res) => emprestimoController.registrar(req, res));
router.put('/:id/devolucao', (req, res) => emprestimoController.devolver(req, res));

export default router;
