import { Router } from 'express';
import acervoRoutes from './acervo.routes.js';
import emprestimoRoutes from './emprestimo.routes.js';
import authRoutes from './auth.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/acervo', acervoRoutes);
apiRouter.use('/emprestimos', emprestimoRoutes);

export default apiRouter;
