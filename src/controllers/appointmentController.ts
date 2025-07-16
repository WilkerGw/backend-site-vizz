import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

// Interface para garantir a tipagem do corpo da requisição
interface AppointmentBody {
  firstName: string;
  lastName: string;
  phone: string;
  dateTime: string;
}

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, dateTime } = req.body as AppointmentBody;

    if (!firstName || !lastName || !phone || !dateTime) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const appointmentDate = new Date(dateTime);

    const existingAppointment = await Appointment.findOne({ dateTime: appointmentDate });
    if (existingAppointment) {
      return res.status(409).json({ error: 'Este horário já foi agendado. Por favor, escolha outro.' });
    }

    const newAppointment = new Appointment({
      firstName,
      lastName,
      phone,
      dateTime: appointmentDate
    });

    await newAppointment.save();

    return res.status(201).json(newAppointment);

  } catch (error: any) {
    console.error("❌ Erro ao criar agendamento:", error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Este horário já foi agendado.' });
    }
    return res.status(500).json({ error: 'Ocorreu um erro no servidor ao criar o agendamento.' });
  }
};