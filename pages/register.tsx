"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/router"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  // Formulário de registro
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  })

  const { user, register } = useAuth()
  const router = useRouter()
  const { callbackUrl } = router.query

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      router.push((callbackUrl as string) || "/")
    }
  }, [user, router, callbackUrl])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const result = await register(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.phone
      )
      
      if (result.success) {
        setMessageType("success")
        setMessage(result.message)
        setTimeout(() => {
          router.push((callbackUrl as string) || "/")
        }, 1500)
      } else {
        setMessageType("error")
        setMessage(result.message)
      }
    } catch (error) {
      setMessageType("error")
      setMessage("Erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData(prev => ({ ...prev, [name]: value }))
  }

  // Se já estiver logado, mostrar loading
  if (user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-gray-300 hover:text-green-500 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao site
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            Criar Conta
          </h1>
          <p className="text-gray-400">
            Crie sua conta para começar a agendar serviços
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-gray-900 rounded-2xl shadow-custom p-8 border border-gray-700">
          {/* Mensagem */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              messageType === "success" 
                ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}>
              {message}
            </div>
          )}

          {/* Formulário de Registro */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input pl-10"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input pl-10"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input pl-10"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="form-input pl-10 pr-12"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Já tem uma conta?
              <button
                onClick={() => router.push("/login")}
                className="ml-1 text-green-500 hover:text-green-400 font-medium"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
