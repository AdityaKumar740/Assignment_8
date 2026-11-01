"use client"

import { createContext, useContext, useState } from "react"

export type User = { id: string; name: string; email: string; photo: string }
type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, name?: string, photo?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>(null)
  const [loading] = useState(false)

  const login = () => {}
  const logout = () => {}

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth must be used inside AuthProvider")
  return value
}
