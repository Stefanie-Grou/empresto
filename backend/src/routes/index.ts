import { Router } from 'express';
import acervoRoutes from './acervo.routes.js';
import emprestimoRoutes from './emprestimo.routes.js';

const apiRouter = Router();

apiRouter.use('/acervo', acervoRoutes);
apiRouter.use('/emprestimos', emprestimoRoutes);

export default apiRouter;
