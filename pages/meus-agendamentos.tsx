// pages/meus-agendamentos.tsx
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "../contexts/AuthContext"

interface Appointment {
  _id: string
  serviceName: string
  servicePrice: number
  appointmentDate: string
  appointmentTime: string
  motorcycle: string
  plate: string
  notes?: string
  status: string
}

export default function MeusAgendamentos() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`/api/auth/agendamentos?userId=${user._id}`)
        const data = await res.json()
        setAppointments(data)
      } catch (err) {
        console.error("Erro ao carregar agendamentos:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user, router])

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente cancelar este agendamento?")) return

    try {
      const res = await fetch(`/api/auth/agendamentos?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a._id !== id))
      } else {
        console.error("Erro ao cancelar agendamento")
      }
    } catch (err) {
      console.error("Erro ao deletar:", err)
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Carregando agendamentos...</p>
  }

  if (appointments.length === 0) {
    return <p className="text-center mt-10 text-gray-600">Você não possui agendamentos.</p>
  }

  return (
    <div className="max-w-4xl mx-auto mt-24 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        📅 Meus Agendamentos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.map((appt) => (
          <div
            key={appt._id}
            className="p-6 border rounded-2xl shadow-lg bg-white hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-600">
                {appt.serviceName}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appt.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : appt.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {appt.status}
              </span>
            </div>

            <p className="text-gray-700">
              <strong>Data:</strong>{" "}
              {new Date(appt.appointmentDate).toLocaleDateString("pt-BR")} -{" "}
              {appt.appointmentTime}
            </p>
            <p className="text-gray-700">
              <strong>Moto:</strong> {appt.motorcycle} ({appt.plate || "sem placa"})
            </p>
            {appt.notes && (
              <p className="text-gray-600 mt-1">
                <strong>Obs:</strong> {appt.notes}
              </p>
            )}
            <p className="text-gray-800 mt-2 font-semibold">
              💲 R$ {appt.servicePrice}
            </p>

            <button
              onClick={() => handleDelete(appt._id)}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}