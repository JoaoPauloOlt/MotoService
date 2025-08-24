import mongoose from 'mongoose'

// Interface para tipar os agendamentos
export interface IAppointment extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  serviceName: string
  servicePrice: number
  appointmentDate: Date // inclui data + hora
  duration: number
  motorcycle: string
  plate?: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

// Schema do Mongoose
const appointmentSchema = new mongoose.Schema<IAppointment>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceName: { type: String, required: true },
  servicePrice: { type: Number, required: true },
  appointmentDate: { type: Date, required: true }, // inclui hora
  duration: { type: Number, required: true, default: 1 },
  motorcycle: { type: String, required: true },
  plate: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending' },
}, { timestamps: true })

// Export do model
export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', appointmentSchema)
