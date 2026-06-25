"use client"

import { createContext, useContext } from "react"

type UserContextType = {
  id_current_user: number
  nombre_usuario_logeado: string
  apellido_usuario_logeado: string
}

const UserContext = createContext<UserContextType>({
  id_current_user: 1,
  nombre_usuario_logeado: "Chimi",
  apellido_usuario_logeado: "Churri",
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserContext.Provider
      value={{
        id_current_user: 1,
        nombre_usuario_logeado: "Chimi",
        apellido_usuario_logeado: "Churri",
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
