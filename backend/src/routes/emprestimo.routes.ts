import { Router } from 'express';
import { emprestimoController } from '../controllers/EmprestimoController.js';

const router = Router();

router.get('/', (req, res) => emprestimoController.listar(req, res));
router.get('/:id', (req, res) => emprestimoController.buscarPorId(req, res));
router.post('/', (req, res) => emprestimoController.registrar(req, res));
router.put('/:id', (req, res) => emprestimoController.atualizar(req, res));
router.put('/:id/renovar', (req, res) => emprestimoController.renovar(req, res));
router.put('/:id/devolucao', (req, res) => emprestimoController.devolver(req, res));
router.delete('/:id', (req, res) => emprestimoController.excluir(req, res));

export default router;
