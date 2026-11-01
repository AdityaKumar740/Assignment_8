"use client"

import { createContext, useContext } from "react"
import { authClient } from "@/lib/auth-client"

export type User = {
  id: string
  name: string
  email: string
  photo: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, name?: string, photo?: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession()
  const betterAuthUser = session.data?.user
  const user: User | null = betterAuthUser
    ? {
        id: betterAuthUser.id,
        name: betterAuthUser.name || betterAuthUser.email?.split("@")[0] || "Community Member",
        email: betterAuthUser.email,
        photo: betterAuthUser.image || "",
      }
    : null

  const login = () => {}
  const logout = async () => {
    await authClient.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading: session.isPending, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth must be used inside AuthProvider")
  return value
}
