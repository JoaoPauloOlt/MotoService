"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

interface User {
  _id: string
  name: string
  email: string
  phone: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um token salvo
    const token = Cookies.get('auth-token')
    if (token) {
      checkAuthStatus(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const checkAuthStatus = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // Token inválido, remover
        Cookies.remove('auth-token')
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      Cookies.remove('auth-token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        Cookies.set('auth-token', data.token, { expires: 7 }) // 7 dias
        return { success: true, message: 'Login realizado com sucesso!' }
      } else {
        return { success: false, message: data.message || 'Erro no login' }
      }
    } catch (error) {
      return { success: false, message: 'Erro de conexão. Tente novamente.' }
    }
  }

  const register = async (name: string, email: string, password: string, phone: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, phone })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        Cookies.set('auth-token', data.token, { expires: 7 }) // 7 dias
        return { success: true, message: 'Cadastro realizado com sucesso!' }
      } else {
        return { success: false, message: data.message || 'Erro no cadastro' }
      }
    } catch (error) {
      return { success: false, message: 'Erro de conexão. Tente novamente.' }
    }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('auth-token')
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
