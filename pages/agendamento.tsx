"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "../contexts/AuthContext"
import Appointment, { IAppointment } from "../models/Appointment"
import { CheckCircle, ArrowLeft, Wrench, Calendar, Clock, Car } from "lucide-react"

export default function AgendamentoPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")

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
      router.push("/login")
    }
  }, [user, isLoading, router])

  const services = [
    { id: "motor", name: "Concerto de Motor", price: 150.0, duration: 4 },
    { id: "direcao", name: "Concerto de Direção", price: 80.0, duration: 2 },
    { id: "suspensao", name: "Concerto de Suspensão", price: 120.0, duration: 3 },
    { id: "balanceamento", name: "Balanceamento", price: 25.0, duration: 1 },
    { id: "oleo", name: "Troca de Óleo", price: 45.0, duration: 1 },
    { id: "freio", name: "Troca de Pastilha de Freio", price: 60.0, duration: 2 },
    { id: "injecao", name: "Injeção Eletrônica", price: 90.0, duration: 3 },
    { id: "eletrica", name: "Elétrica", price: 60.0, duration: 2 },
  ]

  const timeSlots = ["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00"]

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

  const handleNext = () => setStep(prev => prev + 1)
  const handleBack = () => setStep(prev => prev - 1)

  const handleServiceSelect = (serviceId: string) => setSelectedService(serviceId)
  const handleDateSelect = (date: Date) => { setSelectedDate(date); setSelectedTime("") }
  const handleTimeSelect = (time: string) => setSelectedTime(time)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formatDate = (date: Date) => 
    date.toLocaleDateString('pt-BR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

  const getSelectedServiceInfo = () => services.find(s => s.id === selectedService)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    //pegar info do serviço selecionado
    const serviceInfo = getSelectedServiceInfo()

    //se não chegou no último step, só avança
    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    //último step -> enviar pro servidor
    const payload = {
      userId: user?._id,
      serviceName: serviceInfo?.name,
      servicePrice: serviceInfo?.price,
      appointmentDate: selectedDate?.toISOString(),
      appointmentTime: selectedTime,
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
    return <div className="min-h-screen flex items-center justify-center"><p>Carregando autenticação...</p></div>
  }
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 4 ? (
        // Tela de confirmação
        <div className="min-h-screen py-20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Agendamento Confirmado!</h1>
              <p className="text-gray-600 mb-6">
                Seu agendamento foi realizado com sucesso. Entraremos em contato em breve para confirmar os detalhes.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-800 mb-3">Detalhes do Agendamento:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Serviço:</strong> {getSelectedServiceInfo()?.name}</p>
                  <p><strong>Data:</strong> {selectedDate && formatDate(selectedDate)}</p>
                  <p><strong>Horário:</strong> {selectedTime}</p>
                  <p><strong>Cliente:</strong> {formData.name}</p>
                  <p><strong>Telefone:</strong> {formData.phone}</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/")}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Formulário steps 1 a 3
        <>
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
              <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Agendar Serviço</h1>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1,2,3].map((s) => (
                  <div key={s} className={`flex items-center gap-2 ${step >= s ? 'text-red-500' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= s ? 'bg-red-500 text-white' : 'bg-gray-200'
                    }`}>{s}</div>
                    <span className="hidden sm:inline">{s === 1 ? 'Serviço' : s === 2 ? 'Data & Hora' : 'Dados'}</span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Seleção de Serviço */}
              {step === 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Wrench className="text-red-500" /> Escolha o Serviço
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800">{service.name}</h3>
                          <span className="text-lg font-bold text-green-600">
                            R$ {service.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span>{service.duration} hora{service.duration > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Seleção de Data e Hora */}
              {step === 2 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Calendar className="text-red-500" /> Escolha a Data e Hora
                  </h2>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Data</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
                        <div key={d} className="text-center text-sm font-medium text-gray-500 py-2">{d}</div>
                      ))}
                      {availableDates.slice(0,35).map((date,i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleDateSelect(date)}
                          className={`p-3 text-sm rounded-lg transition-all ${
                            selectedDate && selectedDate.toDateString() === date.toDateString()
                              ? 'bg-red-500 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Horário</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {timeSlots.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleTimeSelect(t)}
                            className={`p-3 border-2 rounded-lg transition-all ${
                              selectedTime === t ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Dados do Cliente */}
              {step === 3 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Car className="text-red-500" /> Dados do Cliente e Moto
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['name','email','phone','motorcycle','plate'].map(field => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors resize-none"
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
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
                  className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ml-auto"
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