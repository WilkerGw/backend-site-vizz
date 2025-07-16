import { Schema, model, Document } from 'mongoose';

export interface IAppointment extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  dateTime: Date;
  createdAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  dateTime: { type: Date, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<IAppointment>('Appointment', appointmentSchema);