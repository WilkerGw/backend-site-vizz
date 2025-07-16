import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import appointmentRoutes from './routes/appointmentRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Rota de teste para verificação rápida
app.get('/api/test', (req: Request, res: Response) => {
  res.status(200).json({ message: 'A API do Backend está funcionando!' });
});

// Rotas da aplicação principal
app.use('/api/agendamentos', appointmentRoutes);

// Validação da URI do MongoDB
if (!process.env.MONGODB_URI) {
  console.error("ERRO FATAL: A variável de ambiente MONGODB_URI não está definida.");
  process.exit(1);
}

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso.'))
  .catch(err => console.error('❌ Falha ao conectar ao MongoDB.', err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor da aplicação rodando em http://localhost:${PORT}`);
});