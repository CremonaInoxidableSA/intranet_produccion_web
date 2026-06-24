import { useEffect, useState } from "react"
import { useUser } from "@/context/userContext"

export type TareaUsuario = {
  id_tarea: number
  nombre_operario_seleccionado: string
  apellido_operario_seleccionado: string
  nombre_producto: string
  nombre_labor: string
}

export function useTareasUsuario() {
  const { id_current_user } = useUser()
  const [tareas, setTareas] = useState<TareaUsuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `/api/lista-tareasUsuarioLogueado?id_current_user=${id_current_user}`
        )
        if (!response.ok) throw new Error("Error al obtener tareas")
        const data = await response.json()
        setTareas(data.tareas)
      } catch {
        setError("No se pudo cargar las tareas")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id_current_user])

  return { tareas, loading, error }
}
