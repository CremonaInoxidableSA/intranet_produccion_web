import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import { useTareasUsuario, useDetalleTarea } from "@/context/dataUserContext"

export function useTareaEditor() {
  const [tareaEditando, setTareaEditando] = useState<number | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<number | null>(null)
  const [descripcionEdit, setDescripcionEdit] = useState("")
  const [tiempoExtraEdit, setTiempoExtraEdit] = useState("00:00:00")
  const [dirty, setDirty] = useState(false)
  const [cronometroKey, setCronometroKey] = useState(0)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const [tiempoCronometrado, setTiempoCronometrado] =
    useState<string>("00:00:00")

  const { refetch, removeTareaLocal } = useTareasUsuario()
  const { detalle, loading: loadingDetalle } = useDetalleTarea(tareaEditando)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (detalle) {
      setDescripcionEdit(detalle.descripcion || "")
      setTiempoExtraEdit(detalle.tiempo_extra || "00:00:00")
      setDirty(false)
    }
  }, [detalle])

  useEffect(() => {
    if (detalle) {
      const descChanged = descripcionEdit !== (detalle.descripcion || "")
      const tiempoChanged =
        tiempoExtraEdit !== (detalle.tiempo_extra || "00:00:00")
      setDirty(descChanged || tiempoChanged)
    }
  }, [descripcionEdit, tiempoExtraEdit, detalle])

  const fetchTiempoCronometrado = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/detalles-tiempoCronometradoSeleccionado?id_tarea=${id}`)
      if (!res.ok) throw new Error("Error al obtener tiempo")
      const data = await res.json()
      if (data.tiempo_cronometrado) {
        setTiempoCronometrado(data.tiempo_cronometrado)
      }
    } catch (error) {
      console.error("Error fetching tiempo cronometrado:", error)
    }
  }, [])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (tareaEditando !== null) {
      fetchTiempoCronometrado(tareaEditando)
      intervalRef.current = setInterval(() => {
        if (tareaEditando !== null) {
          fetchTiempoCronometrado(tareaEditando)
        }
      }, 5000)
    } else {
      setTiempoCronometrado("00:00:00")
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [tareaEditando, fetchTiempoCronometrado])

  const handleEliminar = useCallback(async () => {
    const id = filaEliminando
    if (id === null) return

    try {
      const response = await fetch(`/api/eliminar-tarea?id_tarea=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error()
      removeTareaLocal(id)
      setFilaEliminando(null)
      setTareaEditando(null)
      await refetch()
      toast.success("Tarea eliminada")
    } catch {
      toast.error("No se pudo eliminar la tarea")
    }
  }, [filaEliminando, refetch])

  const handleGuardar = useCallback(async () => {
    const id = tareaEditando
    if (!id || !detalle) return

    const descChanged = descripcionEdit !== (detalle.descripcion || "")
    const tiempoChanged =
      tiempoExtraEdit !== (detalle.tiempo_extra || "00:00:00")

    if (!descChanged && !tiempoChanged) {
      toast.info("No hay cambios para guardar")
      return
    }

    const promises = []

    if (descChanged) {
      promises.push(
        fetch("/api/actualizar-descripcion", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_tarea: id, descripcion: descripcionEdit }),
        }).then((res) => res.json())
      )
    }

    if (tiempoChanged) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
      if (!timeRegex.test(tiempoExtraEdit)) {
        toast.error("Formato de tiempo extra inválido. Debe ser HH:MM:SS")
        return
      }
      promises.push(
        fetch("/api/actualizar-tiempExtra", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_tarea: id, tiempo_extra: tiempoExtraEdit }),
        }).then((res) => res.json())
      )
    }

    try {
      const results = await Promise.all(promises)
      const hasError = results.some((r) => r.success === false || r.error)
      if (hasError) {
        results.forEach((r) => {
          if (r.success === false || r.error) {
            toast.error(r.error || r.detail || "Error al guardar")
          }
        })
      } else {
        toast.success("Cambios guardados correctamente")
        setDirty(false)
        refetch()
        setTareaEditando(null)
      }
    } catch {
      toast.error("Error al conectar con el servidor")
    }
  }, [tareaEditando, detalle, descripcionEdit, tiempoExtraEdit, refetch])

  const handleReiniciarCronometro = useCallback(async () => {
    const id = tareaEditando
    if (!id) return

    try {
      const res = await fetch("/api/reiniciarCronometro", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_tarea: id }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Cronómetro reiniciado")
        await fetchTiempoCronometrado(id)
        setCronometroKey((prev) => prev + 1)
      } else {
        toast.error(data.error || "Error al reiniciar cronómetro")
      }
    } catch {
      toast.error("Error al conectar con el servidor")
    }
  }, [tareaEditando, fetchTiempoCronometrado])

  const resetEditor = useCallback(() => {
    setTareaEditando(null)
    setDirty(false)
  }, [])

  return {
    // Estados
    tareaEditando,
    setTareaEditando,
    filaEliminando,
    setFilaEliminando,
    descripcionEdit,
    setDescripcionEdit,
    tiempoExtraEdit,
    setTiempoExtraEdit,
    dirty,
    cronometroKey,
    showCloseConfirm,
    setShowCloseConfirm,
    loadingDetalle,
    detalle,
    tiempoCronometrado,

    // Acciones
    handleEliminar,
    handleGuardar,
    handleReiniciarCronometro,
    resetEditor,
  }
}
