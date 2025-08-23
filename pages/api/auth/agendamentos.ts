// pages/api/agendamento/index.ts
import type { NextApiRequest, NextApiResponse } from "next"
import mongoose from "mongoose"
import dbConnect from "../../../lib/mongodb"
import Appointment from "../../../models/Appointment"
import jwt from "jsonwebtoken"

// Função para verificar o token
const verifyToken = (req: NextApiRequest) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    return decoded
  } catch (error) {
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  // Criar agendamento
  if (req.method === "POST") {
    try {
      const decoded = verifyToken(req)
      if (!decoded) {
        return res.status(401).json({ message: "Token inválido" })
      }

      const {
        serviceName,
        servicePrice,
        appointmentDate,
        appointmentTime,
        duration,
        motorcycle,
        plate,
        notes,
      } = req.body

      const userId = decoded.userId || decoded._id

      console.log("Criando agendamento para:", userId)

      // Verificar conflitos de horário antes de criar
      const selectedDateTime = new Date(appointmentDate)
      const [hours, minutes] = appointmentTime.split(':').map(Number)
      selectedDateTime.setHours(hours, minutes, 0, 0)
      
      const endTime = new Date(selectedDateTime.getTime() + (duration || 1) * 60 * 60 * 1000)

      // Verificar se o usuário já tem agendamento no mesmo horário neste dia
      const userAppointmentsOnDate = await Appointment.find({
        userId: new mongoose.Types.ObjectId(userId),
        appointmentDate: {
          $gte: new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate()),
          $lt: new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate() + 1)
        },
        status: { $ne: 'cancelled' }
      })

      // Verificar se o usuário já tem agendamento no mesmo horário neste dia
      const userHasAppointmentAtTime = userAppointmentsOnDate.some(appt => {
        const apptStart = new Date(appt.appointmentDate)
        const apptEnd = new Date(apptStart.getTime() + (appt.duration || 1) * 60 * 60 * 1000)
        
        // Verificar sobreposição de horários para o mesmo usuário
        return (selectedDateTime < apptEnd && endTime > apptStart)
      })

      if (userHasAppointmentAtTime) {
        return res.status(400).json({ 
          message: "Você já possui um agendamento neste horário. Escolha outro horário ou data." 
        })
      }

      // Buscar agendamentos existentes no mesmo dia
      const existingAppointments = await Appointment.find({
        appointmentDate: {
          $gte: new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate()),
          $lt: new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate() + 1)
        },
        status: { $ne: 'cancelled' }
      })

      // Verificar se há sobreposição de horários
      const hasConflict = existingAppointments.some(appt => {
        const apptStart = new Date(appt.appointmentDate)
        const apptEnd = new Date(apptStart.getTime() + (appt.duration || 1) * 60 * 60 * 1000)
        
        return (selectedDateTime < apptEnd && endTime > apptStart)
      })

      if (hasConflict) {
        return res.status(400).json({ 
          message: "Este horário não está disponível. Já existe um agendamento neste período." 
        })
      }

      const newAppointment = await Appointment.create({
        userId,
        serviceName,
        servicePrice,
        appointmentDate,
        appointmentTime,
        duration: duration || 1,
        motorcycle,
        plate,
        notes,
        status: "pending",
      })

      return res.status(201).json(newAppointment)
    } catch (error: any) {
      console.error("Erro ao criar agendamento:", error.message, error)
      return res.status(500).json({ message: error.message })
    }
  }

  // Buscar agendamentos
  if (req.method === "GET") {
    try {
      const decoded = verifyToken(req)
      if (!decoded) {
        return res.status(401).json({ message: "Token inválido" })
      }

      const userId = decoded.userId || decoded._id
      console.log("Buscando agendamentos de:", userId)

      // Buscar apenas agendamentos do usuário autenticado
      const appointments = await Appointment.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ appointmentDate: 1, appointmentTime: 1 })

      return res.status(200).json(appointments)
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error)
      return res.status(500).json({ message: "Erro ao buscar agendamentos." })
    }
  }

  // Deletar agendamento
  if (req.method === "DELETE") {
    try {
      const decoded = verifyToken(req)
      if (!decoded) {
        return res.status(401).json({ message: "Token inválido" })
      }

      const { id } = req.query
      if (!id) {
        return res.status(400).json({ message: "ID do agendamento não fornecido." })
      }

      // Verificar se o agendamento pertence ao usuário
      const appointment = await Appointment.findById(id)
      if (!appointment) {
        return res.status(404).json({ message: "Agendamento não encontrado." })
      }

      const userId = decoded.userId || decoded._id
      if (appointment.userId.toString() !== userId) {
        return res.status(403).json({ message: "Não autorizado a cancelar este agendamento." })
      }

      console.log("Deletando agendamento:", id)

      const deleted = await Appointment.findByIdAndDelete(id)
      if (!deleted) {
        return res.status(404).json({ message: "Agendamento não encontrado." })
      }

      return res.status(200).json({ message: "Agendamento cancelado com sucesso." })
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error)
      return res.status(500).json({ message: "Erro ao cancelar agendamento." })
    }
  }

  return res.status(405).json({ message: "Método não permitido" })
}