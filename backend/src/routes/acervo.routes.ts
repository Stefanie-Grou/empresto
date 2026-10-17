import { Router } from 'express';
import { acervoController } from '../controllers/AcervoController.js';

const router = Router();

router.get('/', (req, res) => acervoController.listar(req, res));
router.post('/', (req, res) => acervoController.cadastrar(req, res));
router.put('/:id', (req, res) => acervoController.atualizar(req, res));
router.delete('/:id', (req, res) => acervoController.excluir(req, res));
router.post('/:acervoId/fila', (req, res) => acervoController.adicionarFila(req, res));

export default router;
