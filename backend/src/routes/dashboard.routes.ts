import { Router } from 'express';
import { dashboardController } from '../controllers/DashboardController.js';

const router = Router();

router.get('/resumo', (req, res) => dashboardController.resumo(req, res));
router.get('/stats', (req, res) => dashboardController.resumo(req, res));

export default router;
