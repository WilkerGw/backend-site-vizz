// backend/src/server.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import clientPromise from './lib/mongodb'; // Importa a conexão com o DB
import { Appointment } from './models/Appointment'; // Importa o modelo

// --- INÍCIO DA LÓGICA DO SERVIDOR ---

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares essenciais
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// --- ROTA DEFINIDA DIRETAMENTE AQUI ---

// O endpoint completo será POST http://localhost:3001/api/agendamentos
app.post('/api/agendamentos', async (req: Request, res: Response) => {
  console.log(`[${new Date().toLocaleTimeString()}] 🚀 Requisição recebida em POST /api/agendamentos`);
  console.log("📦 Dados recebidos no corpo:", req.body);

  try {
    const { firstName, lastName, phone, date, time } = req.body as Appointment;

    // Validação robusta
    if (!firstName || !lastName || !phone || !date || !time) {
      console.error("❌ ERRO DE VALIDAÇÃO: Campos obrigatórios faltando.");
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const client = await clientPromise;
    const db = client.db("otica_vizz");

    const newAppointment: Appointment = {
      firstName,
      lastName,
      phone,
      date,
      time,
      createdAt: new Date(),
    };

    const result = await db.collection('agendamentos').insertOne(newAppointment);

    console.log("✅ SUCESSO: Agendamento inserido no banco de dados!", { insertedId: result.insertedId });
    res.status(201).json({ message: 'Agendamento criado com sucesso!', data: newAppointment });

  } catch (error) {
    console.error('🔥 ERRO FATAL no servidor:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Rota de teste para garantir que o servidor está no ar
app.get('/api', (req, res) => {
  res.send('API da Óticas Vizz está online!');
});


// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Backend iniciado com sucesso na porta ${PORT}`);
  console.log(`📡 Aguardando requisições em http://localhost:${PORT}`);
});