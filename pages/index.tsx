"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Menu,
  X,
  Wrench,
  Cog,
  Shield,
  CircleDot as Tire,
  PenTool as Tools,
  Droplet,
  Filter,
  Car,
  SprayCan as Spray,
  Cpu,
  Laptop,
  Zap,
  Wind,
} from "lucide-react"

export default function MotoServicePage() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const services = [
    {
      name: "Concerto de Motor",
      price: 150.0,
      icon: Wrench,
      description: "Reparo e manutenção completa do motor com peças de qualidade e garantia",
    },
    {
      name: "Concerto de Direção",
      price: 80.0,
      icon: Cog,
      description: "Reparo e regulagem do sistema de direção para máxima segurança",
    },
    {
      name: "Concerto de Suspensão",
      price: 120.0,
      icon: Shield,
      description: "Reparo e regulagem do sistema de suspensão para melhor estabilidade",
    },
    {
      name: "Balanceamento",
      price: 25.0,
      icon: Tire,
      description: "Balanceamento de rodas para eliminar vibrações e desgaste irregular",
    },
    {
      name: "Mecânica em Geral",
      price: 50.0,
      icon: Tools,
      description: "Serviços gerais de mecânica para todas as marcas e modelos de motos",
    },
    {
      name: "Troca de Óleo",
      price: 45.0,
      icon: Droplet,
      description: "Troca de óleo do motor com filtro para manter o motor funcionando perfeitamente",
    },
    {
      name: "Troca de Filtro de Combustível",
      price: 35.0,
      icon: Filter,
      description: "Substituição do filtro de combustível para melhor desempenho",
    },
    {
      name: "Troca de Pastilha de Freio",
      price: 60.0,
      icon: Car,
      description: "Substituição das pastilhas de freio dianteiro e traseiro",
    },
    {
      name: "Troca de Lona de Freio",
      price: 40.0,
      icon: Car,
      description: "Substituição da lona de freio traseiro para máxima segurança",
    },
    {
      name: "Limpeza de Bico",
      price: 70.0,
      icon: Spray,
      description: "Limpeza e regulagem dos bicos injetores para melhor combustão",
    },
    {
      name: "Injeção Eletrônica",
      price: 90.0,
      icon: Cpu,
      description: "Diagnóstico e reparo do sistema de injeção eletrônica",
    },
    {
      name: "Scanner Elétrico",
      price: 40.0,
      icon: Laptop,
      description: "Diagnóstico computadorizado para identificar problemas elétricos",
    },
    { name: "Elétrica", price: 60.0, icon: Zap, description: "Reparo e manutenção do sistema elétrico da moto" },
    {
      name: "Limpeza de Carburador",
      price: 80.0,
      icon: Wind,
      description: "Limpeza completa e regulagem do carburador para melhor funcionamento",
    },
  ]

  const bookService = (serviceName: string, price: number) => {
    const message = `Olá! Gostaria de agendar o serviço: ${serviceName} - R$ ${price.toFixed(2)}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const message = formData.get("message") as string

    // Here you would typically send the data to your backend
    console.log("Contact form submitted:", { name, email, phone, message })
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
    e.currentTarget.reset()
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-slate-800/95 backdrop-blur-sm" : "bg-gradient-to-r from-slate-800 to-slate-700"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/img/logoSnap.webp" alt="MotoService Logo" className="h-16 w-16 rounded-full" />
            <span className="text-2xl font-bold text-red-500">MotoService</span>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex gap-8">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  Contato
                </button>
              </li>
              <li className="flex gap-4">
                {user ? (
                  <>
                    <a
                      href={`/login?callbackUrl=/meus-agendamentos`}
                      className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Meus Agendamentos
                    </a>

                    <a
                      href={`/login?callbackUrl=/agendamento`}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Agendar
                    </a>

                  </>
                ) : (
                  <a
                    href={`/login?callbackUrl=/meus-agendamentos`}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Entrar
                  </a>

                )}
              </li>
            </ul>
          </nav>

          <button className="md:hidden text-white text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-600">
            <ul className="flex flex-col p-4 gap-4">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  Contato
                </button>
              </li>
              <li>
                {user ? (
                  <div className="flex gap-2">
                    <a
                      href="/agendamento"
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Agendar
                    </a>
                    <a
                      href="/meus-agendamentos"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Meus Agendamentos
                    </a>
                  </div>
                ) : (
                  <a
                    href="/login"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Entrar
                  </a>
                )}
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">Especialistas em Motos</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Oferecemos serviços de qualidade para sua moto com preços justos e garantia de satisfação. Nossa equipe é
            especializada em todas as marcas e modelos.
          </p>
          <button
            onClick={() => scrollToSection("services")}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Ver Serviços
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Nossos Serviços</h2>
            <p className="text-xl text-gray-600">Serviços profissionais com preços transparentes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                >
                  <div className="text-red-500 mb-4 flex justify-center">
                    <IconComponent size={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">{service.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    {service.price >= 50
                      ? `A partir de R$ ${service.price.toFixed(2)}`
                      : `R$ ${service.price.toFixed(2)}`}
                  </div>
                  <button
                    onClick={() => window.location.href = `/agendamento?service=${encodeURIComponent(service.name)}&price=${service.price}`}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
                  >
                    Agendar
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Sobre Nós</h2>
            <p className="text-xl text-gray-600">Conheça nossa história e compromisso com a qualidade</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold text-slate-800">Mais de 15 anos de experiência</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                A MotoService nasceu da paixão por motos e do compromisso com a excelência em serviços automotivos.
                Nossa equipe é composta por técnicos certificados e experientes, sempre atualizados com as últimas
                tecnologias do mercado.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Oferecemos serviços para todas as marcas e modelos de motos, desde as mais populares até as mais
                exclusivas. Nossa missão é proporcionar a melhor experiência possível aos nossos clientes, com
                transparência, qualidade e preços justos.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Possuímos equipamentos de última geração e utilizamos apenas peças de qualidade, garantindo a
                durabilidade e o desempenho de sua moto.
              </p>
            </div>
                         <div className="relative">
               <img 
                 src="/img/motorcycle-mechanic-garage.png" 
                 alt="Nossa Oficina de Mecânica de Motos" 
                 className="rounded-2xl shadow-xl w-full h-96 object-cover"
               />
             </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Entre em Contato</h2>
            <p className="text-xl text-gray-300">Estamos aqui para ajudar com sua moto</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-red-500 mb-6">Informações de Contato</h3>

              <div className="flex items-center gap-4">
                <MapPin className="text-red-500 flex-shrink-0" size={24} />
                <span className="text-lg">Rua das Motos, 123 - Centro, São Paulo - SP</span>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-red-500 flex-shrink-0" size={24} />
                <span className="text-lg">(11) 99999-9999</span>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-red-500 flex-shrink-0" size={24} />
                <span className="text-lg">contato@motoservice.com.br</span>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-red-500 flex-shrink-0 mt-1" size={24} />
                <div className="text-lg">
                  <div>Segunda a Sexta: 8h às 18h</div>
                  <div>Sábado: 8h às 12h</div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Seu Nome"
                  required
                  className="w-full p-4 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Seu Email"
                  required
                  className="w-full p-4 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Seu Telefone"
                  required
                  className="w-full p-4 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                />
                <textarea
                  name="message"
                  placeholder="Mensagem"
                  rows={5}
                  required
                  className="w-full p-4 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-300"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-2xl hover:text-red-500 transition-colors">
              📘
            </a>
            <a href="#" className="text-2xl hover:text-red-500 transition-colors">
              📷
            </a>
            <a href="#" className="text-2xl hover:text-red-500 transition-colors">
              💬
            </a>
            <a href="#" className="text-2xl hover:text-red-500 transition-colors">
              📺
            </a>
          </div>
          <p className="text-gray-400">&copy; 2024 MotoService. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
