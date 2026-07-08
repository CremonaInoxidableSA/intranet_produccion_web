import { useEffect, useState, useCallback } from "react"
import { useUser } from "@/context/userContext"
import { fetchWithConnectionCheck } from "@/lib/connectionManager"

export type TareaUsuario = {
  id_tarea: number
  nombre_operario_seleccionado: string
  apellido_operario_seleccionado: string
  nombre_producto: string
  nombre_labor: string
  estado: string
}

export function useTareasUsuario() {
  const { id_current_user } = useUser()
  const [tareas, setTareas] = useState<TareaUsuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetchWithConnectionCheck(
        `/api/listas/lista-tareasUsuarioLogueado?id_current_user=${id_current_user}&_=${Date.now()}`,
        { cache: "no-store" }
      )
      if (!response.ok) throw new Error()
      const data = await response.json()
      setTareas(data.tareas ?? [])
    } catch {
      setError("No se pudo cargar las tareas")
    } finally {
      setLoading(false)
    }
  }, [id_current_user])

  const removeTareaLocal = useCallback((id: number) => {
    setTareas((prev) => prev.filter((t) => t.id_tarea !== id))
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { tareas, loading, error, refetch: fetchData, removeTareaLocal }
}

export type DetalleTarea = {
  id_tarea: number
  nombre_operario_seleccionado: string
  apellido_operario_seleccionado: string
  nombre_sector: string
  numero_op: number
  numero_plano: string
  nombre_producto: string
  nombre_labor: string
  descripcion: string
  tiempo_extra: string
  estado: string
}

export function useDetalleTarea(id_tarea: number | null) {
  const [detalle, setDetalle] = useState<DetalleTarea | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetalle = useCallback(async () => {
    if (id_tarea === null) {
      setDetalle(null)
      return
    }
    setLoading(true)
    try {
      const response = await fetchWithConnectionCheck(
        `/api/detalles/detalles-tareaActivaSeleccionada?id_tarea=${id_tarea}`
      )
      if (!response.ok) throw new Error("Error al obtener detalle")
      const data: DetalleTarea = await response.json()
      setDetalle(data)
    } catch {
      setError("No se pudo cargar el detalle de la tarea")
    } finally {
      setLoading(false)
    }
  }, [id_tarea])

  useEffect(() => {
    fetchDetalle()
  }, [fetchDetalle])

  return { detalle, loading, error, refetch: fetchDetalle }
}

export type DetalleTareaFinalizada = {
  id_tarea: number
  fecha_inicio: Date
  fecha_fin: Date
  apellido_creador: string
  nombre_creador: string
  apellido_operario_seleccionado: string
  nombre_operario_seleccionado: string
  nombre_sector: string
  numero_op: number
  numero_plano: string
  nombre_producto: string
  nombre_labor: string
  descripcion: string
  tiempo_extra: string
  tiempo_cronometrado: string
  tiempo_total: string
  eventos: [
    {
      fecha: Date
      titulo: string
    },
  ]
}

export function useDetalleTareaFinalizada(id_tarea: number | null) {
  const [detalle, setDetalle] = useState<DetalleTareaFinalizada | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetalle = useCallback(async () => {
    if (id_tarea === null) {
      setDetalle(null)
      return
    }
    setLoading(true)
    try {
      const response = await fetchWithConnectionCheck(
        `/api/detalles/detalles-tareaFinalizada?id_tarea=${id_tarea}`
      )
      if (!response.ok) throw new Error("Error al obtener detalle")
      const data: DetalleTareaFinalizada = await response.json()
      setDetalle(data)
    } catch {
      setError("No se pudo cargar el detalle de la tarea")
    } finally {
      setLoading(false)
    }
  }, [id_tarea])

  useEffect(() => {
    fetchDetalle()
  }, [fetchDetalle])

  return { detalle, loading, error, refetch: fetchDetalle }
}
