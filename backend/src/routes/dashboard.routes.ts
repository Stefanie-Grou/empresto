import { Router } from 'express';
import { dashboardController } from '../controllers/DashboardController.js';

const router = Router();

router.get('/stats', (req, res) => dashboardController.getStats(req, res));

export default router;
