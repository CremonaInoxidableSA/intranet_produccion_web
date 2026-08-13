"use client"

import { createContext, useContext } from "react"
import type { UserContextType } from "@/types/types"

const UserContext = createContext<UserContextType>({
  id_current_user: 1,
  nombre_usuario_logeado: "Pruebas",
  apellido_usuario_logeado: "Usuario",
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserContext.Provider
      value={{
        id_current_user: 1,
        nombre_usuario_logeado: "Pruebas",
        apellido_usuario_logeado: "Usuario",
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
