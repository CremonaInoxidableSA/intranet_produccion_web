// funciones.tsx
import { useState, useEffect, useCallback } from "react"
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

  const { refetch, removeTareaLocal } = useTareasUsuario()
  const { detalle, loading: loadingDetalle } = useDetalleTarea(tareaEditando)

  // Sincronizar estados editables con el detalle
  useEffect(() => {
    if (detalle) {
      setDescripcionEdit(detalle.descripcion || "")
      setTiempoExtraEdit(detalle.tiempo_extra || "00:00:00")
      setDirty(false)
    }
  }, [detalle])

  // Detectar cambios para habilitar el botón Guardar
  useEffect(() => {
    if (detalle) {
      const descChanged = descripcionEdit !== (detalle.descripcion || "")
      const tiempoChanged =
        tiempoExtraEdit !== (detalle.tiempo_extra || "00:00:00")
      setDirty(descChanged || tiempoChanged)
    }
  }, [descripcionEdit, tiempoExtraEdit, detalle])

  // Eliminar tarea
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

  // Guardar cambios (descripción y tiempo extra)
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
        fetch("/api/actualizar-tiempo-extra", {
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

  // Reiniciar cronómetro
  const handleReiniciarCronometro = useCallback(async () => {
    const id = tareaEditando
    if (!id) return

    try {
      const res = await fetch("/api/reiniciar-tiempo-cronometrado", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_tarea: id }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Cronómetro reiniciado")
        setCronometroKey((prev) => prev + 1) // forzar reinicio visual
      } else {
        toast.error(data.error || "Error al reiniciar cronómetro")
      }
    } catch {
      toast.error("Error al conectar con el servidor")
    }
  }, [tareaEditando])

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

    // Acciones
    handleEliminar,
    handleGuardar,
    handleReiniciarCronometro,
    resetEditor,
  }
}
