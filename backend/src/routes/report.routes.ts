import { Router } from 'express';
import { reportController } from '../controllers/ReportController.js';

const router = Router();

router.get('/resumo', (req, res) => reportController.resumo(req, res));

export default router;
