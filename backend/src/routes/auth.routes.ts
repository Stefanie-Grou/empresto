import { Router } from 'express';
import { authController } from '../controllers/AuthController.js';

const router = Router();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/cadastro', (req, res) => authController.cadastrar(req, res));
router.post('/register', (req, res) => authController.cadastrar(req, res));

export default router;
