import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import { useDetalleTarea } from "@/context/dataUserContext"
import { handleApiResponse } from "@/lib/response-handler"

interface UseTareaEditorProps {
  refetch: () => Promise<void>
  removeTareaLocal: (id: number) => void
}

export function useTareaEditor({
  refetch,
  removeTareaLocal,
}: UseTareaEditorProps) {
  const [tareaEditando, setTareaEditando] = useState<number | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<number | null>(null)
  const [descripcionEdit, setDescripcionEdit] = useState("")
  const [tiempoExtraEdit, setTiempoExtraEdit] = useState("00:00:00")
  const [dirty, setDirty] = useState(false)
  const [cronometroKey, setCronometroKey] = useState(0)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [showReiniciarConfirm, setShowReiniciarConfirm] = useState(false)

  const [tiempoCronometrado, setTiempoCronometrado] =
    useState<string>("00:00:00")
  const {
    detalle,
    loading: loadingDetalle,
    refetch: refetchDetalle,
  } = useDetalleTarea(tareaEditando)

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
      const res = await fetch(
        `/api/detalles/detalles-tareaActivaCronometradoSeleccionado?id_tarea=${id}`
      )
      if (!res.ok) {
        if (res.status === 404) {
          setTiempoCronometrado("00:00:00")
          return
        }
        throw new Error("Error al obtener tiempo")
      }
      const data = await res.json()
      if (data.tiempo_cronometrado) {
        setTiempoCronometrado(data.tiempo_cronometrado)
      } else {
        setTiempoCronometrado("00:00:00")
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

    if (tareaEditando === null || !detalle) return

    const isActive = detalle.estado?.toLowerCase() === "activa"

    fetchTiempoCronometrado(tareaEditando)

    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (
          tareaEditando !== null &&
          detalle?.estado?.toLowerCase() === "activa"
        ) {
          fetchTiempoCronometrado(tareaEditando)
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [tareaEditando, detalle?.estado, fetchTiempoCronometrado])

  const handleEliminar = useCallback(async () => {
    const id = filaEliminando
    if (id === null) return

    try {
      const res = await fetch(`/api/eliminar/eliminar-tarea?id_tarea=${id}`, {
        method: "DELETE",
      })

      await handleApiResponse(res)

      removeTareaLocal(id)
      setFilaEliminando(null)
      setTareaEditando(null)
      await refetch()
    } catch {}
  }, [filaEliminando, refetch, removeTareaLocal])

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
        fetch("/api/actualizar/actualizar-descripcion", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_tarea: id, descripcion: descripcionEdit }),
        })
      )
    }

    if (tiempoChanged) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
      if (!timeRegex.test(tiempoExtraEdit)) {
        toast.error("Formato de tiempo extra inválido. Debe ser HH:MM:SS")
        return
      }
      promises.push(
        fetch("/api/actualizar/actualizar-tiempoExtra", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_tarea: id, tiempo_extra: tiempoExtraEdit }),
        })
      )
    }

    try {
      const responses = await Promise.all(promises)

      for (const res of responses) {
        await handleApiResponse(res)
      }

      setDirty(false)
      refetch()
    } catch (error) {
      console.error("Error en handleGuardar:", error)
    }
  }, [tareaEditando, detalle, descripcionEdit, tiempoExtraEdit, refetch])

  const handleReiniciarCronometro = useCallback(async () => {
    const id = tareaEditando
    if (!id) return

    try {
      const res = await fetch(
        "/api/actualizar/actualizar-reiniciarCronometro",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_tarea: id }),
        }
      )

      await handleApiResponse(res)

      await fetchTiempoCronometrado(id)
      setCronometroKey((prev) => prev + 1)
      setShowReiniciarConfirm(false)
    } catch {}
  }, [tareaEditando, fetchTiempoCronometrado])

  const resetEditor = useCallback(() => {
    setTareaEditando(null)
    setDirty(false)
  }, [])

  const handlePausarTarea = useCallback(async () => {
    const id = tareaEditando
    if (!id) return

    const esPausada = detalle?.estado?.toLowerCase() === "pausada"
    const url = esPausada
      ? `/api/actualizar/actualizar-despausarCronometro?id_tarea=${id}`
      : `/api/actualizar/actualizar-pausarCronometro?id_tarea=${id}`

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      await handleApiResponse(res)

      await refetchDetalle()

      if (!esPausada) {
      } else {
        setTimeout(() => {
          fetchTiempoCronometrado(id)
        }, 500)
      }
    } catch {}
  }, [tareaEditando, detalle?.estado, refetchDetalle, fetchTiempoCronometrado])

  const handleFinalizar = useCallback(async () => {
    const id = tareaEditando
    if (!id) return

    try {
      const res = await fetch(
        `/api/actualizar/actualizar-finalizarTarea?id_tarea=${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      )

      await handleApiResponse(res)
      removeTareaLocal(id)
      setTareaEditando(null)
      await refetch()
    } catch {}
  }, [tareaEditando, refetch, removeTareaLocal])

  return {
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
    showReiniciarConfirm,
    setShowReiniciarConfirm,
    handleEliminar,
    handleGuardar,
    handleReiniciarCronometro,
    resetEditor,
    handlePausarTarea,
    handleFinalizar,
  }
}
