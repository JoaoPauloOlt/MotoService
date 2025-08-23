"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "../contexts/AuthContext"
import Appointment, { IAppointment } from "../models/Appointment"
import { CheckCircle, ArrowLeft, Wrench, Calendar, Clock, Car, MessageCircle } from "lucide-react"

export default function AgendamentoPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [customDuration, setCustomDuration] = useState<number>(1)
  const [existingAppointments, setExistingAppointments] = useState<any[]>([])

  const [formData, setFormData] = useState({
    userId: user?._id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    motorcycle: "",
    plate: "",
    notes: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?callbackUrl=/agendamento")
      return
    }
  }, [user, isLoading, router])

  // Lista de serviços apenas com os que aparecem no index
  const services = [
    { id: "motor", name: "Concerto de Motor", price: 150.0, duration: 4, category: "Motor" },
    { id: "direcao", name: "Concerto de Direção", price: 80.0, duration: 2, category: "Direção" },
    { id: "suspensao", name: "Concerto de Suspensão", price: 120.0, duration: 3, category: "Suspensão" },
    { id: "balanceamento", name: "Balanceamento", price: 25.0, duration: 1, category: "Rodas" },
    { id: "oleo", name: "Troca de Óleo", price: 45.0, duration: 1, category: "Manutenção" },
    { id: "filtro-combustivel", name: "Troca de Filtro de Combustível", price: 35.0, duration: 1, category: "Combustível" },
    { id: "freio", name: "Troca de Pastilha de Freio", price: 60.0, duration: 2, category: "Freios" },
    { id: "lona-freio", name: "Troca de Lona de Freio", price: 40.0, duration: 1, category: "Freios" },
    { id: "bico", name: "Limpeza de Bico", price: 70.0, duration: 2, category: "Combustível" },
    { id: "injecao", name: "Injeção Eletrônica", price: 90.0, duration: 3, category: "Elétrica" },
    { id: "scanner", name: "Scanner Elétrico", price: 40.0, duration: 1, category: "Diagnóstico" },
    { id: "eletrica", name: "Elétrica", price: 60.0, duration: 2, category: "Elétrica" },
    { id: "carburador", name: "Limpeza de Carburador", price: 80.0, duration: 2, category: "Combustível" },
  ]

  // Horários de trabalho conforme especificado no index
  const getTimeSlots = (dayOfWeek: number) => {
    if (dayOfWeek === 0) return [] // Domingo - fechado
    if (dayOfWeek === 6) return ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"] // Sábado - 9h às 15h
    return ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"] // Segunda a Sexta - 8h às 19h
  }

  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      if (date.getDay() !== 0) dates.push(date) // excluir domingos
    }
    return dates
  }

  const availableDates = generateAvailableDates()

  // Verificar se uma data está disponível para o usuário (sem agendamento prévio)
  const isDateAvailableForUser = (date: Date) => {
    if (!user || !existingAppointments.length) return true
    
    const dateString = date.toISOString().split('T')[0]
    
    // Verificar se o usuário já tem agendamento neste dia
    const userHasAppointmentOnDate = existingAppointments.some(appt => {
      const apptDate = appt.appointmentDate.split('T')[0]
      return apptDate === dateString && appt.status !== 'cancelled'
    })
    
    // Agora permite múltiplos agendamentos por dia (um por horário)
    // A data só fica indisponível se todos os horários estiverem ocupados
    return true
  }

  // Buscar agendamentos existentes para verificação de conflitos
  useEffect(() => {
    const fetchExistingAppointments = async () => {
      try {
        const res = await fetch("/api/auth/agendamentos")
        if (res.ok) {
          const data = await res.json()
          setExistingAppointments(data)
        }
      } catch (err) {
        console.error("Erro ao carregar agendamentos existentes:", err)
      }
    }
    
    // Só buscar agendamentos se o usuário estiver logado
    if (user) {
      fetchExistingAppointments()
    }
  }, [user])

  // Verificar se há conflito de horário (melhorada)
  const checkTimeConflict = (date: Date, time: string, duration: number) => {
    const selectedDateTime = new Date(date)
    const [hours, minutes] = time.split(':').map(Number)
    selectedDateTime.setHours(hours, minutes, 0, 0)
    
    const endTime = new Date(selectedDateTime.getTime() + duration * 60 * 60 * 1000)

    return existingAppointments.some(appt => {
      // Verificar se é o mesmo dia
      if (appt.appointmentDate.split('T')[0] !== date.toISOString().split('T')[0]) return false
      
      // Verificar se o status não é cancelado
      if (appt.status === 'cancelled') return false
      
      const apptStart = new Date(appt.appointmentDate)
      const apptEnd = new Date(apptStart.getTime() + (appt.duration || 1) * 60 * 60 * 1000)
      
      // Verificar sobreposição de horários
      return (selectedDateTime < apptEnd && endTime > apptStart)
    })
  }

  const handleNext = () => setStep(prev => prev + 1)
  const handleBack = () => setStep(prev => prev - 1)

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    const service = services.find(s => s.id === serviceId)
    if (service) {
      setCustomDuration(service.duration)
    }
  }
  
  const handleDateSelect = (date: Date) => { 
    setSelectedDate(date)
    setSelectedTime("")
  }
  
  const handleTimeSelect = (time: string) => setSelectedTime(time)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formatDate = (date: Date) => 
    date.toLocaleDateString('pt-BR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

  const getSelectedServiceInfo = () => services.find(s => s.id === selectedService)

  // Função para abrir WhatsApp com mensagem automática baseada no serviço
  const openWhatsApp = (serviceName: string, price: number) => {
    const message = `Olá! Gostaria de agendar o serviço: ${serviceName} - R$ ${price.toFixed(2)}`
    const whatsappUrl = `https://wa.me/5511947202939?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    //pegar info do serviço selecionado
    const serviceInfo = getSelectedServiceInfo()

    //se não chegou no último step, só avança
    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    // Verificar conflito de horário
    if (selectedDate && selectedTime && checkTimeConflict(selectedDate, selectedTime, customDuration)) {
      alert("Este horário não está disponível. Por favor, escolha outro horário.")
      return
    }

    //último step -> enviar pro servidor
    const payload = {
      userId: user?._id,
      serviceName: serviceInfo?.name,
      servicePrice: serviceInfo?.price,
      appointmentDate: selectedDate?.toISOString(),
      appointmentTime: selectedTime,
      duration: customDuration,
      motorcycle: formData.motorcycle,
      plate: formData.plate,
      notes: formData.notes,
    }
  
    try {
      const res = await fetch("/api/auth/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
  
      const data = await res.json() // pega a resposta do servidor
      if (res.ok) {
        alert("Agendamento realizado com sucesso!")
        setStep(4) // vai para a tela de confirmação
      } else {
        console.error("Erro do servidor:", data)
        alert("Erro ao agendar. Tente novamente.")
      }
    } catch (err) {
      console.error("Erro no fetch:", err)
      alert("Erro no servidor.")
    }
  }  

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Carregando autenticação...</p></div>
  }
  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {step === 4 ? (
        // Tela de confirmação
        <div className="min-h-screen py-20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-gray-900 rounded-2xl shadow-xl p-8 text-center border border-gray-700">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Agendamento Confirmado!</h1>
              <p className="text-gray-300 mb-6">
                Seu agendamento foi realizado com sucesso. Entraremos em contato em breve para confirmar os detalhes.
              </p>
              <div className="bg-gray-800 rounded-lg p-6 mb-6 text-left border border-gray-700">
                <h3 className="font-semibold text-white mb-3">Detalhes do Agendamento:</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong>Serviço:</strong> {getSelectedServiceInfo()?.name}</p>
                  <p><strong>Data:</strong> {selectedDate && formatDate(selectedDate)}</p>
                  <p><strong>Horário:</strong> {selectedTime}</p>
                  <p><strong>Duração:</strong> {customDuration} hora{customDuration > 1 ? 's' : ''}</p>
                  <p><strong>Cliente:</strong> {formData.name}</p>
                  <p><strong>Telefone:</strong> {formData.phone}</p>
                </div>
              </div>
              
              {/* Botão WhatsApp */}
              <div className="mb-6">
                <a
                  href={`https://wa.me/5511947202939?text=${encodeURIComponent(
                    `Olá! Acabei de agendar o serviço: ${getSelectedServiceInfo()?.name} para ${selectedDate && formatDate(selectedDate)} às ${selectedTime}. Gostaria de confirmar os detalhes.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <MessageCircle size={20} />
                  Confirmar no WhatsApp
                </a>
              </div>
              
              <button
                onClick={() => router.push("/")}
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Formulário steps 1 a 3
        <>
          <header className="bg-gray-900 shadow-sm border-b border-gray-700">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
              <button onClick={() => router.back()} className="text-gray-300 hover:text-white transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-white">Agendar Serviço</h1>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1,2,3].map((s) => (
                  <div key={s} className={`flex items-center gap-2 ${step >= s ? 'text-green-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= s ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'
                    }`}>{s}</div>
                    <span className="hidden sm:inline">{s === 1 ? 'Serviço' : s === 2 ? 'Data & Hora' : 'Dados'}</span>
                  </div>
                ))}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Seleção de Serviço */}
              {step === 1 && (
                <div className="bg-gray-900 rounded-2xl shadow-custom p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Wrench className="text-green-500" /> Escolha o Serviço
                  </h2>
                  
                  <div className="services-grid">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className={`service-card cursor-pointer ${
                          selectedService === service.id
                            ? 'border-green-500 bg-gray-800'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-white">{service.name}</h3>
                          <span className="text-lg font-bold text-green-500">
                            R$ {service.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock size={16} />
                          <span>{service.duration} hora{service.duration > 1 ? 's' : ''}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{service.category}</div>
                        
                        {/* Botão WhatsApp para cada serviço */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            openWhatsApp(service.name, service.price)
                          }}
                          className="mt-3 w-full bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageCircle size={16} />
                          Falar no WhatsApp
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Duração personalizada */}
                  {selectedService && (
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duração do Serviço (horas)
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        max="8"
                        step="0.5"
                        value={customDuration}
                        onChange={(e) => setCustomDuration(Number(e.target.value))}
                        className="form-input w-32"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Seleção de Data e Hora */}
              {step === 2 && (
                <div className="bg-gray-900 rounded-2xl shadow-custom p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Calendar className="text-green-500" /> Escolha a Data e Hora
                  </h2>
                  
                  {/* Informações sobre horários de trabalho */}
                  <div className="mb-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h3 className="font-semibold text-green-400 mb-2">Horários de Trabalho:</h3>
                    <div className="text-sm text-green-300 space-y-1">
                      <p><strong>Segunda a Sexta:</strong> 8h às 19h</p>
                      <p><strong>Sábados e feriados:</strong> 9h às 15h</p>
                      <p><strong>Domingos:</strong> Fechado</p>
                    </div>
                  </div>

                  {/* Informação sobre limitação de agendamentos */}
                  <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h3 className="font-semibold text-blue-400 mb-2">Regra de Agendamento:</h3>
                    <div className="text-sm text-blue-300">
                      <p><strong>Limite:</strong> Apenas 1 agendamento por horário por dia</p>
                      <p><strong>Nota:</strong> Você pode agendar múltiplos serviços em dias diferentes</p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Data</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
                        <div key={d} className="text-center text-sm font-medium text-gray-400 py-2">{d}</div>
                      ))}
                      {availableDates.slice(0,35).map((date,i) => {
                        const isAvailable = isDateAvailableForUser(date)
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => isAvailable && handleDateSelect(date)}
                            disabled={!isAvailable}
                            className={`p-3 text-sm rounded-lg transition-all ${
                              selectedDate && selectedDate.toDateString() === date.toDateString()
                                ? 'bg-red-500 text-black' // Changed to red for selected date
                                : isAvailable
                                ? 'hover:bg-gray-800 text-gray-300'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                            title={!isAvailable ? 'Você já possui agendamento neste dia' : ''}
                          >
                            {date.getDate()}
                            {!isAvailable && <div className="text-xs text-red-400">Indisponível</div>}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Horário</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {getTimeSlots(selectedDate.getDay()).map(t => {
                          const hasConflict = checkTimeConflict(selectedDate, t, customDuration)
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => handleTimeSelect(t)}
                              disabled={hasConflict}
                              className={`p-3 border-2 rounded-lg transition-all ${
                                selectedTime === t 
                                  ? 'border-green-500 bg-green-500/20 text-green-400' 
                                  : hasConflict
                                  ? 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                                  : 'border-gray-600 hover:border-gray-500 text-gray-300'
                              }`}
                            >
                              {t}
                              {hasConflict && <div className="text-xs text-red-400">Indisponível</div>}
                            </button>
                          )
                        })}
                      </div>
                      {getTimeSlots(selectedDate.getDay()).length === 0 && (
                        <p className="text-gray-500 text-center py-4">Este dia não possui horários disponíveis.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Dados do Cliente */}
              {step === 3 && (
                <div className="bg-gray-900 rounded-2xl shadow-custom p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Car className="text-green-500" /> Dados do Cliente e Moto
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['name','email','phone','motorcycle','plate'].map(field => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {field === 'name' ? 'Nome Completo *' :
                           field === 'email' ? 'Email *' :
                           field === 'phone' ? 'Telefone *' :
                           field === 'motorcycle' ? 'Modelo da Moto *' :
                           'Placa'}
                        </label>
                        <input
                          type={field === 'email' ? 'email':'text'}
                          name={field}
                          value={formData[field as keyof typeof formData]}
                          onChange={handleInputChange}
                          required={['name','email','phone','motorcycle'].includes(field)}
                          className="form-input"
                          placeholder={
                            field === 'name' ? 'Seu nome completo' :
                            field === 'email' ? 'seu@email.com' :
                            field === 'phone' ? '(11) 99999-9999' :
                            field === 'motorcycle' ? 'Ex: Honda CG 150' :
                            'ABC-1234'
                          }
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="form-input resize-none"
                        placeholder="Alguma observação sobre o serviço ou a moto..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={
                    (step === 1 && !selectedService) ||
                    (step === 2 && (!selectedDate || !selectedTime)) ||
                    (step === 3 && (!formData.name || !formData.email || !formData.phone || !formData.motorcycle))
                  }
                  className="btn-primary disabled:bg-gray-600 disabled:cursor-not-allowed ml-auto"
                >
                  {step === 3 ? 'Confirmar Agendamento' : 'Continuar'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}