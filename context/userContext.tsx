"use client"

import { createContext, useContext } from "react"

type UserContextType = {
  id_current_user: number
}

const UserContext = createContext<UserContextType>({
  id_current_user: 1,
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserContext.Provider value={{ id_current_user: 1 }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
