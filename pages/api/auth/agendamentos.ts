// pages/api/agendamento/index.ts
import type { NextApiRequest, NextApiResponse } from "next"
import mongoose from "mongoose"
import dbConnect from "../../../lib/mongodb"
import Appointment from "../../../models/Appointment"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  // Criar agendamento
  if (req.method === "POST") {
    try {
      const {
        userId,
        serviceName,
        servicePrice,
        appointmentDate,
        appointmentTime,
        motorcycle,
        plate,
        notes,
      } = req.body

      console.log("Criando agendamento para:", userId)

      const newAppointment = await Appointment.create({
        userId,
        serviceName,
        servicePrice,
        appointmentDate,
        appointmentTime,
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
      const { userId } = req.query

      console.log("Buscando agendamentos de:", userId)

      let query = {}
      if (userId) {
        query = { userId: new mongoose.Types.ObjectId(userId as string) }
      }

      const appointments = await Appointment.find(query).populate("userId", "name email phone")

      return res.status(200).json(appointments)
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error)
      return res.status(500).json({ message: "Erro ao buscar agendamentos." })
    }
  }

  // Deletar agendamento
  if (req.method === "DELETE") {
    try {
      const { id } = req.query

      if (!id) {
        return res.status(400).json({ message: "ID do agendamento não fornecido." })
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