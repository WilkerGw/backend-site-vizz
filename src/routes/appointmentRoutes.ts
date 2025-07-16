import { Router } from 'express';
import { createAppointment } from '../controllers/appointmentController';

const router = Router();

// Define a rota para o método POST na raiz do que foi definido no server.ts
// Ou seja, responde por "POST /api/agendamentos"
router.post('/', createAppointment);

export default router;