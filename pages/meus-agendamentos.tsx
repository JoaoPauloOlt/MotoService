"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "../contexts/AuthContext"
import { ArrowLeft, Home, Clock, Calendar, DollarSign, Car, MessageCircle, LogOut, User } from "lucide-react"

interface Appointment {
  _id: string
  serviceName: string
  servicePrice: number
  appointmentDate: string
  appointmentTime: string
  duration: number
  motorcycle: string
  plate: string
  notes: string
  status: string
  createdAt: string
}

export default function MeusAgendamentosPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?callbackUrl=/meus-agendamentos")
      return
    }

    if (user) {
      fetchAppointments()
    }
  }, [user, isLoading, router])

  const fetchAppointments = async () => {
    try {
      // Buscar o token do cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1]

      const res = await fetch('/api/auth/agendamentos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        setAppointments(data)
      } else {
        console.error('Erro ao buscar agendamentos:', res.status, res.statusText)
      }
    } catch (err) {
      console.error("Erro ao carregar agendamentos:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'confirmed':
        return 'status-confirmed'
      case 'cancelled':
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'confirmed':
        return 'Confirmado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Pendente'
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Carregando autenticação...</p></div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-300 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white">Meus Agendamentos</h1>
          </div>
          
          {/* User Info and Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <User size={16} />
              <span className="text-sm">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Título da seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Meus</span>
            <span className="text-green-500"> Agendamentos</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Acompanhe todos os seus serviços agendados
          </p>
        </div>

        {/* Lista de agendamentos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400 mt-4">Carregando agendamentos...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
              <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-gray-400 mb-6">
                Você ainda não possui agendamentos. Que tal agendar seu primeiro serviço?
              </p>
              <button
                onClick={() => router.push("/agendamento")}
                className="btn-primary"
              >
                Agendar Serviço
              </button>
            </div>
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map((appt) => (
              <div key={appt._id} className="service-card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{appt.serviceName}</h3>
                  <span className={getStatusColor(appt.status)}>
                    {getStatusText(appt.status)}
                  </span>
                </div>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-green-500" />
                    <span><strong>Data:</strong> {formatDate(appt.appointmentDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-green-500" />
                    <span><strong>Horário:</strong> {formatTime(appt.appointmentDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-green-500" />
                    <span><strong>Duração:</strong> {appt.duration || 1} hora{(appt.duration || 1) > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-500" />
                    <span><strong>Preço:</strong> R$ {(appt.servicePrice || 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Car size={16} className="text-green-500" />
                    <span><strong>Moto:</strong> {appt.motorcycle}</span>
                  </div>
                  
                  {appt.plate && (
                    <div className="flex items-center gap-2">
                      <Car size={16} className="text-green-500" />
                      <span><strong>Placa:</strong> {appt.plate}</span>
                    </div>
                  )}
                  
                  {appt.notes && (
                    <div className="pt-2 border-t border-gray-700">
                      <p className="text-sm text-gray-400">
                        <strong>Observações:</strong> {appt.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botão WhatsApp para confirmar detalhes */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <a
                    href={`https://wa.me/5511947202939?text=${encodeURIComponent(
                      `Olá! Gostaria de confirmar os detalhes do meu agendamento: ${appt.serviceName} para ${formatDate(appt.appointmentDate)} às ${formatTime(appt.appointmentTime)}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full justify-center"
                  >
                    <MessageCircle size={16} />
                    Confirmar no WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão para agendar novo serviço */}
        {appointments.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/agendamento")}
              className="btn-primary text-lg px-8 py-4"
            >
              Agendar Novo Serviço
            </button>
          </div>
        )}
      </div>
    </div>
  )
}