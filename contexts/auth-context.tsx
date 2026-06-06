"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { api, type ApiUsuario } from "@/lib/api"

interface AuthContextType {
  user: ApiUsuario | null
  token: string | null
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  register: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => void
  authModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUsuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("orbit_token")
    if (stored) {
      setToken(stored)
      api.auth
        .me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("orbit_token")
          setToken(null)
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, senha: string) => {
    const data = await api.auth.login(email, senha)
    localStorage.setItem("orbit_token", data.access_token)
    setToken(data.access_token)
    setUser(data.usuario)
  }, [])

  const register = useCallback(async (nome: string, email: string, senha: string) => {
    const data = await api.auth.register({ nome, email, senha })
    localStorage.setItem("orbit_token", data.access_token)
    setToken(data.access_token)
    setUser(data.usuario)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("orbit_token")
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        authModalOpen,
        openAuthModal: () => setAuthModalOpen(true),
        closeAuthModal: () => setAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
