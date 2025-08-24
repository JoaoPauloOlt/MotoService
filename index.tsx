import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import { Menu as MenuIcon, X } from "lucide-react"

export default function Menu() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
          isScrolled
            ? "bg-slate-800/95 backdrop-blur-sm"
            : "bg-gradient-to-r from-slate-800 to-slate-700"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="/img/logoSnap.webp"
              alt="MotoService Logo"
              className="h-16 w-16 rounded-full"
            />
            <span className="text-2xl font-bold text-red-500">SnapMotoPeças</span>
          </div>

          {/* Menu Desktop */}
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

              {user && (
                <li>
                  <button
                    onClick={() => router.push("/meus-agendamentos")}
                    className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Meus Agendamentos
                  </button>
                </li>
              )}

              <li>
                {user ? (
                  <a
                    href="/agendamento"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Agendar
                  </a>
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
          </nav>

          {/* Botão mobile */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Menu Mobile */}
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

              {user && (
                <li>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push("/meus-agendamentos")
                    }}
                    className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
                  >
                    Meus Agendamentos
                  </button>
                </li>
              )}

              <li>
                {user ? (
                  <a
                    href="/agendamento"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
                  >
                    Agendar
                  </a>
                ) : (
                  <a
                    href="/login"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
                  >
                    Entrar
                  </a>
                )}
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  )
}