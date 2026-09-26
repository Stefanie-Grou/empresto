import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.json({
    sistema: 'Emprestô API',
    versao: '1.0.0',
    base: '/api/v1',
    status: 'online',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Emprestô rodando na porta ${PORT}`);
  console.log(`Base URL: http://localhost:${PORT}/api/v1`);
});

export default app;
