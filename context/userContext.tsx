"use client"

import { createContext, useContext, useMemo } from "react"
import { useAuth } from "@/context/AuthProvider"
import type { UserContextType } from "@/types/types"

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  const value = useMemo<UserContextType>(() => {
    const parsedId = Number.parseInt(String(user?.id ?? ""), 10)

    return {
      id_current_user: Number.isFinite(parsedId) ? parsedId : 0,
      nombre_usuario_logeado: user?.nombre ?? "",
      apellido_usuario_logeado: user?.apellido ?? "",
    }
  }, [user])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}
