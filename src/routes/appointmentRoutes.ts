// backend/src/routes/appointmentRoutes.ts

import { Router, Request, Response } from 'express';
import clientPromise from '../lib/mongodb';
import { Appointment } from '../models/Appointment';

const router = Router();

// **DEFINIÇÃO DA ROTA CORRETA**
// Esta rota agora é '/agendamentos'. O Express vai juntá-la com '/api' do server.ts.
// O resultado final será o endpoint: POST /api/agendamentos
router.post('/agendamentos', async (req: Request, res: Response) => {
  console.log(`[${new Date().toLocaleTimeString()}] ℹ️  INFO: Requisição recebida em POST /agendamentos`);
  console.log("ℹ️  INFO: Dados do corpo da requisição:", req.body);

  try {
    const { firstName, lastName, phone, date, time } = req.body as Appointment;

    if (!firstName || !lastName || !phone || !date || !time) {
      console.error("❌ ERROR: Validação falhou. Campos obrigatórios estão faltando.");
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const client = await clientPromise;
    const db = client.db("otica_vizz"); // Certifique-se que o nome do banco está correto

    const newAppointment: Appointment = {
      firstName,
      lastName,
      phone,
      date,
      time,
      createdAt: new Date(),
    };

    const result = await db.collection('agendamentos').insertOne(newAppointment);

    console.log("✅ SUCCESS: Agendamento inserido no banco de dados!", { insertedId: result.insertedId });
    res.status(201).json({ message: 'Agendamento criado com sucesso!', data: newAppointment });

  } catch (error) {
    console.error('🔥 FATAL: Erro interno do servidor ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

export default router;