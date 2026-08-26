import { useState, useEffect, useCallback, useRef, useReducer } from "react"
import { toast } from "sonner"
import { useDetalleTarea } from "@/context/dataUserContext"
import { handleApiResponse } from "@/lib/response-handler"
import { fetchWithConnectionCheck } from "@/lib/connectionManager"
import type { FormAction, FormState, TareaEditorProps } from "@/types/types"

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FORM":
      return {
        ...state,
        descripcion: action.payload.descripcion,
        tiempoExtra: action.payload.tiempoExtra,
        cantidad: action.payload.cantidad,
        dirty: false,
      }
    case "UPDATE_DESCRIPCION":
      return {
        ...state,
        descripcion: action.payload,
        dirty: true,
      }
    case "UPDATE_TIEMPO_EXTRA":
      return {
        ...state,
        tiempoExtra: action.payload,
        dirty: true,
      }
    case "RESET_DIRTY":
      return {
        ...state,
        dirty: false,
      }
    case "SET_DIRTY":
      return {
        ...state,
        dirty: true,
      }
    default:
      return state
  }
}

export function useTareaEditor({
  refetch,
  removeTareaLocal,
}: TareaEditorProps) {
  const [tareaEditando, setTareaEditando] = useState<number | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<number | null>(null)
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
  const timerIdRef = useRef<number | null>(null)

  const [formState, dispatch] = useReducer(formReducer, {
    descripcion: "",
    tiempoExtra: "00:00:00",
    cantidad: 1,
    dirty: false,
  })

  const descripcionEdit = formState.descripcion
  const tiempoExtraEdit = formState.tiempoExtra
  const dirty = formState.dirty

  useEffect(() => {
    if (detalle) {
      dispatch({
        type: "SET_FORM",
        payload: {
          descripcion: detalle.descripcion || "",
          tiempoExtra: detalle.tiempo_extra || "00:00:00",
          cantidad: detalle.cantidad || 1,
        },
      })
    }
  }, [detalle])

  const fetchTiempoCronometrado = useCallback(async (id: number) => {
    try {
      const res = await fetchWithConnectionCheck(
        `/api/detalles/detalles-tareaActivaCronometradoSeleccionado?id_tarea=${id}`
      )
      if (!res.ok) {
        if (res.status === 404) {
          return "00:00:00"
        }
        throw new Error("Error al obtener tiempo")
      }
      const data = await res.json()
      return data.tiempo_cronometrado || "00:00:00"
    } catch (error) {
      console.error("Error fetching tiempo cronometrado:", error)
      return "00:00:00"
    }
  }, [])

  const actualizarTiempoCronometrado = useCallback(
    async (id: number) => {
      const nuevoTiempo = await fetchTiempoCronometrado(id)
      setTiempoCronometrado(nuevoTiempo)
    },
    [fetchTiempoCronometrado]
  )

  useEffect(() => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current)
      timerIdRef.current = null
    }

    if (tareaEditando !== null && detalle) {
      const isActive = detalle.estado?.toLowerCase() === "activa"

      if (isActive) {
        void (async () => {
          await actualizarTiempoCronometrado(tareaEditando)
        })()

        intervalRef.current = setInterval(() => {
          if (
            tareaEditando !== null &&
            detalle?.estado?.toLowerCase() === "activa"
          ) {
            void (async () => {
              await actualizarTiempoCronometrado(tareaEditando)
            })()
          } else {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
          }
        }, 5000)
      } else {
        void (async () => {
          await actualizarTiempoCronometrado(tareaEditando)
        })()
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current)
        timerIdRef.current = null
      }
    }
  }, [tareaEditando, detalle, actualizarTiempoCronometrado])

  const handleEliminar = useCallback(async () => {
    const id = filaEliminando
    if (id === null) return

    try {
      const res = await fetchWithConnectionCheck(
        `/api/eliminar/eliminar-tarea?id_tarea=${id}`,
        {
          method: "DELETE",
        }
      )

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
        fetchWithConnectionCheck("/api/actualizar/actualizar-descripcion", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_tarea: id, descripcion: descripcionEdit }),
        })
      )
    }

    if (tiempoChanged) {
      const timeRegex = /^[0-9]+:[0-5][0-9]:[0-5][0-9]$/
      if (!timeRegex.test(tiempoExtraEdit)) {
        toast.error("Formato de tiempo extra inválido. Debe ser HH:MM:SS")
        return
      }
      promises.push(
        fetchWithConnectionCheck("/api/actualizar/actualizar-tiempoExtra", {
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

      await refetchDetalle()
      dispatch({ type: "RESET_DIRTY" })
      await refetch()
    } catch (error) {
      console.error("Error en handleGuardar:", error)
    }
  }, [
    tareaEditando,
    detalle,
    descripcionEdit,
    tiempoExtraEdit,
    refetch,
    refetchDetalle,
  ])

  const handleReiniciarCronometro = useCallback(async () => {
    const id = tareaEditando
    if (!id) return

    try {
      const res = await fetchWithConnectionCheck(
        "/api/actualizar/actualizar-reiniciarCronometro",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_tarea: id }),
        }
      )

      await handleApiResponse(res)

      setTiempoCronometrado("00:00:00")
      await Promise.all([refetchDetalle(), actualizarTiempoCronometrado(id)])
      setCronometroKey((prev) => prev + 1)
      setShowReiniciarConfirm(false)
    } catch {}
  }, [tareaEditando, actualizarTiempoCronometrado, refetchDetalle])

  const resetEditor = useCallback(() => {
    setTareaEditando(null)
    dispatch({ type: "RESET_DIRTY" })
  }, [])

  const handlePausarTarea = useCallback(async () => {
    const id = tareaEditando
    if (!id) return

    const esPausada = detalle?.estado?.toLowerCase() === "pausada"
    const url = esPausada
      ? `/api/actualizar/actualizar-despausarCronometro?id_tarea=${id}`
      : `/api/actualizar/actualizar-pausarCronometro?id_tarea=${id}`

    try {
      const res = await fetchWithConnectionCheck(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      await handleApiResponse(res)

      await Promise.all([refetchDetalle(), refetch()])

      if (!esPausada) {
      } else {
        setTimeout(() => {
          actualizarTiempoCronometrado(id)
        }, 500)
      }
    } catch {}
  }, [
    tareaEditando,
    detalle?.estado,
    refetchDetalle,
    refetch,
    actualizarTiempoCronometrado,
  ])

  const handleFinalizar = useCallback(async () => {
    const id = tareaEditando
    if (!id) return

    try {
      const res = await fetchWithConnectionCheck(
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
    setDescripcionEdit: (value: string) =>
      dispatch({ type: "UPDATE_DESCRIPCION", payload: value }),
    tiempoExtraEdit,
    setTiempoExtraEdit: (value: string) =>
      dispatch({ type: "UPDATE_TIEMPO_EXTRA", payload: value }),
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
