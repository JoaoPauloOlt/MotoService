"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "../contexts/AuthContext"
import { Menu, X, MessageCircle, Phone, MapPin, Clock, Wrench, Star, ArrowRight, LogOut, User } from "lucide-react"

export default function HomePage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const bookService = (serviceName: string) => {
    if (user) {
      router.push("/agendamento")
    } else {
      router.push("/login?callbackUrl=/agendamento")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsMenuOpen(false)
  }

  const services = [
    { name: "Concerto de Motor", description: "Reparo completo de motores com garantia", price: "R$ 150,00", icon: "🔧" },
    { name: "Concerto de Direção", description: "Ajuste e reparo do sistema de direção", price: "R$ 80,00", icon: "🎯" },
    { name: "Concerto de Suspensão", description: "Manutenção e reparo da suspensão", price: "R$ 120,00", icon: "⚡" },
    { name: "Balanceamento", description: "Balanceamento de rodas e pneus", price: "R$ 25,00", icon: "⚖️" },
    { name: "Troca de Óleo", description: "Troca de óleo e filtros", price: "R$ 45,00", icon: "🛢️" },
    { name: "Troca de Filtro de Combustível", description: "Substituição do filtro de combustível", price: "R$ 35,00", icon: "⛽" },
    { name: "Troca de Pastilha de Freio", description: "Substituição das pastilhas de freio", price: "R$ 60,00", icon: "🛑" },
    { name: "Troca de Lona de Freio", description: "Substituição das lonas de freio", price: "R$ 40,00", icon: "🛑" },
    { name: "Limpeza de Bico", description: "Limpeza e regulagem dos bicos injetores", price: "R$ 70,00", icon: "💧" },
    { name: "Injeção Eletrônica", description: "Diagnóstico e reparo da injeção", price: "R$ 90,00", icon: "🔌" },
    { name: "Scanner Elétrico", description: "Diagnóstico completo com scanner", price: "R$ 40,00", icon: "📱" },
    { name: "Elétrica", description: "Reparo de sistemas elétricos", price: "R$ 60,00", icon: "⚡" },
    { name: "Limpeza de Carburador", description: "Limpeza e regulagem do carburador", price: "R$ 80,00", icon: "🔧" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled ? "header-scrolled" : "header-gradient"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/img/logoSnap.webp" alt="MotoService Logo" className="h-12 w-auto" />
            <h1 className="text-2xl font-bold text-green-500">SnapMotoPeças</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("servicos")} className="text-gray-300 hover:text-green-500 transition-colors">
              Serviços
            </button>
            <button onClick={() => scrollToSection("sobre")} className="text-gray-300 hover:text-green-500 transition-colors">
              Sobre
            </button>
            <button onClick={() => scrollToSection("contato")} className="text-gray-300 hover:text-green-500 transition-colors">
              Contato
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <User size={16} />
                  <span className="text-sm">{user.name}</span>
                </div>
                <button
                  onClick={() => router.push("/meus-agendamentos")}
                  className="btn-secondary"
                >
                  Meus Agendamentos
                </button>
                <button
                  onClick={() => router.push("/agendamento")}
                  className="btn-primary"
                >
                  Agendar Serviço
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/login")}
                  className="btn-secondary"
                >
                  Entrar
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="btn-primary"
                >
                  Cadastrar
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold text-green-500">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white p-2"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* User Info Mobile */}
              {user && (
                <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-green-500" />
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <nav className="flex-1">
                <button
                  onClick={() => scrollToSection("servicos")}
                  className="mobile-menu-item"
                >
                  Serviços
                </button>
                <button
                  onClick={() => scrollToSection("sobre")}
                  className="mobile-menu-item"
                >
                  Sobre
                </button>
                <button
                  onClick={() => scrollToSection("contato")}
                  className="mobile-menu-item"
                >
                  Contato
                </button>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        router.push("/meus-agendamentos")
                        setIsMenuOpen(false)
                      }}
                      className="mobile-menu-item"
                    >
                      Meus Agendamentos
                    </button>
                    <button
                      onClick={() => {
                        router.push("/agendamento")
                        setIsMenuOpen(false)
                      }}
                      className="mobile-menu-item bg-green-500 text-black font-semibold"
                    >
                      Agendar Serviço
                    </button>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="mobile-menu-item bg-gray-700 text-white"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push("/login")
                        setIsMenuOpen(false)
                      }}
                      className="mobile-menu-item"
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => {
                        router.push("/register")
                        setIsMenuOpen(false)
                      }}
                      className="mobile-menu-item bg-green-500 text-black font-semibold"
                    >
                      Cadastrar
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/img/motorcycle-mechanic-garage.png"
            alt="Oficina de Moto"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="hero-overlay absolute inset-0"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-bounce-in">
            <span className="text-white">SnapMoto</span>
            <span className="text-green-500">Peças</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slide-up max-w-3xl mx-auto">
            Especialistas em manutenção e reparo de motocicletas. 
            Qualidade profissional com preços justos e atendimento personalizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <button
              onClick={() => bookService("")}
              className="btn-primary text-lg px-8 py-4 rounded-full"
            >
              {user ? "Agendar Serviço" : "Fazer Login para Agendar"}
            </button>
            <a
              href="https://wa.me/5511947202934?text=Olá! Gostaria de saber mais sobre os serviços da SnapMotopeças."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-lg px-8 py-4 rounded-full"
            >
              <MessageCircle size={24} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Nossos</span>
              <span className="text-green-500"> Serviços</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Oferecemos uma ampla gama de serviços para manter sua moto funcionando perfeitamente
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card group">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-500 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-500">{service.price}</span>
                  <button
                    onClick={() => bookService(service.name)}
                    className="text-green-500 hover:text-green-400 transition-colors flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                  >
                    {user ? "Agendar" : "Fazer Login"} <ArrowRight size={16} />
                  </button>
                </div>
                
                {/* Botão WhatsApp para cada serviço */}
                <button
                  onClick={() => {
                    const message = `Olá! Gostaria de agendar o serviço: ${service.name} - ${service.price}`
                    const whatsappUrl = `https://wa.me/5511947202934?text=${encodeURIComponent(message)}`
                    window.open(whatsappUrl, "_blank")
                  }}
                  className="btn-whatsapp w-full"
                >
                  <MessageCircle size={16} />
                  Falar no WhatsApp
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-white">Sobre a</span>
                <span className="text-green-500"> SnapMotopeças</span>
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                Somos uma oficina especializada em motocicletas com anos de experiência no mercado. 
                Nossa missão é oferecer serviços de qualidade com transparência e confiança.
                Com anos de experiência e dedicação, oferecemos soluções eficientes e confiáveis para manter sua motocicleta em perfeitas condições, sempre prezando pela segurança e desempenho do seu veículo.

              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Wrench className="text-green-500" size={20} />
                  <span className="text-gray-300">Técnicos certificados e experientes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="text-green-500" size={20} />
                  <span className="text-gray-300">Garantia em todos os serviços</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-green-500" size={20} />
                  <span className="text-gray-300">Agendamento online e atendimento rápido</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/img/motorcycle-workshop-garage-tools.png"
                alt="Ferramentas da Oficina"
                className="rounded-2xl shadow-custom-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Entre em</span>
              <span className="text-green-500"> Contato</span>
            </h2>
            <p className="text-xl text-gray-400">
              Estamos aqui para ajudar com sua moto
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 p-3 rounded-full">
                  <Phone className="text-black" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Telefone</h3>
                  <p className="text-gray-400">(11) 94720-2934</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500 p-3 rounded-full">
                  <MapPin className="text-black" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Endereço</h3>
                  <p className="text-gray-400">Rua Estância Velha, 241b - Jardim Lider, São Paulo - SP - 02983-130</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500 p-3 rounded-full">
                  <Clock className="text-black" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Horários de Trabalho</h3>
                  <div className="text-gray-400">
                    <div>Segunda a Sexta: 8h às 19h</div>
                    <div>Sábados, Domingos e Feriados: 9h às 15h</div>
                  </div>
                </div>
              </div>

              {/* Botão WhatsApp proeminente */}
              <div className="pt-4">
                <a
                  href="https://wa.me/5511947202934?text=Olá! Gostaria de saber mais sobre os serviços da SnapMotopeças."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full text-center justify-center"
                >
                  <MessageCircle size={20} />
                  Falar no WhatsApp
                </a>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8 shadow-custom">
              <h3 className="text-2xl font-bold text-white mb-6">Envie uma Mensagem</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="form-input"
                />
                <input
                  type="email"
                  placeholder="Seu email"
                  className="form-input"
                />
                <textarea
                  placeholder="Sua mensagem"
                  rows={4}
                  className="form-input resize-none"
                ></textarea>
                <button type="submit" className="btn-primary w-full">
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src="/img/logoSnap.webp" alt="MotoService Logo" className="h-10 w-auto" />
            <h3 className="text-2xl font-bold text-green-500">SnapMotopeças</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Especialistas em motocicletas com qualidade e confiança
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="footer-social">
              <Phone size={24} />
            </a>
            <a href="#" className="footer-social">
              <MessageCircle size={24} />
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-500">
              © 2024 SnapMotoPeças. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
