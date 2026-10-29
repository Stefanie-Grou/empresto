import { Router } from 'express';
import acervoRoutes from './acervo.routes.js';
import emprestimoRoutes from './emprestimo.routes.js';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';

import reportRoutes from './report.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/acervo', acervoRoutes);
apiRouter.use('/inventory', acervoRoutes);
apiRouter.use('/emprestimos', emprestimoRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/relatorios', reportRoutes);

export default apiRouter;
