"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { format, startOfWeek, endOfWeek } from "date-fns"

import { type DateRange } from "react-day-picker"
import {
  useFiltrosEnCurso,
  useFiltrosFinalizadas,
} from "@/context/dataGeneralContext"
import { toast } from "sonner"
import { useDetalleTarea } from "@/context/dataUserContext"
import { handleApiResponse } from "@/lib/response-handler"
import { fetchWithConnectionCheck } from "@/lib/connectionManager"
import type { MonitoreoTareaEditorProps, Tarea } from "@/types/types"

export function toOptions(items: (string | number)[]) {
  return items.map((item) => ({ id: String(item), nombre: String(item) }))
}

function buildPayloadBase(
  ops: (number | string)[],
  planos: string[],
  operarios: string[],
  sectores: string[]
) {
  return {
    numeros_op: ops.length ? ops.map(Number) : [0],
    numeros_plano: planos.length ? planos : ["0"],
    operarios: operarios.length ? operarios : ["0"],
    sectores: sectores.length ? sectores : ["0"],
  }
}

export function useMonitoreoEnCurso() {
  const { filtros, loading: loadingFiltros } = useFiltrosEnCurso()

  const [opSel, setOpSel] = useState<(number | string)[]>([])
  const [planoSel, setPlanoSel] = useState<string[]>([])
  const [operarioSel, setOperarioSel] = useState<string[]>([])
  const [sectorSel, setSectorSel] = useState<string[]>([])
  const initializedRef = useRef(false)

  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTareas = useCallback(
    async (
      ops: (number | string)[],
      planos: string[],
      operarios: string[],
      sectores: string[]
    ) => {
      setLoading(true)
      try {
        const res = await fetchWithConnectionCheck(
          "/api/tareas/tareas-activas-general",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              buildPayloadBase(ops, planos, operarios, sectores)
            ),
          }
        )
        const data = await res.json()
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.tareas)
            ? data.tareas
            : []
        setTareas(lista)
      } catch {
        setTareas([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (loadingFiltros || initializedRef.current) return
    initializedRef.current = true
    fetchTareas([], [], [], [])
  }, [loadingFiltros, fetchTareas])

  const aplicarFiltros = useCallback(() => {
    return fetchTareas(opSel, planoSel, operarioSel, sectorSel)
  }, [opSel, planoSel, operarioSel, sectorSel, fetchTareas])

  return {
    filtros,
    opSel,
    setOpSel,
    planoSel,
    setPlanoSel,
    operarioSel,
    setOperarioSel,
    sectorSel,
    setSectorSel,
    tareas,
    loading,
    aplicarFiltros,
  }
}

export function useMonitoreoFinalizadas() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfWeek(new Date(), { weekStartsOn: 0 }),
    to: endOfWeek(new Date(), { weekStartsOn: 0 }),
  })

  const fechaInicioStr = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd")
    : undefined
  const fechaFinStr = dateRange?.to
    ? format(dateRange.to, "yyyy-MM-dd")
    : undefined

  const [filtrosRefreshVersion, setFiltrosRefreshVersion] = useState(0)

  const { filtros, loading: loadingFiltros } = useFiltrosFinalizadas(
    fechaInicioStr,
    fechaFinStr,
    filtrosRefreshVersion
  )

  const [opSel, setOpSel] = useState<(number | string)[]>([])
  const [planoSel, setPlanoSel] = useState<string[]>([])
  const [operarioSel, setOperarioSel] = useState<string[]>([])
  const [sectorSel, setSectorSel] = useState<string[]>([])
  const initializedRef = useRef(false)

  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTareas = useCallback(
    async (
      ops: (number | string)[],
      planos: string[],
      operarios: string[],
      sectores: string[],
      range: DateRange | undefined
    ) => {
      if (!range?.from || !range?.to) return
      setLoading(true)
      try {
        const res = await fetchWithConnectionCheck(
          "/api/tareas/tareas-finalizadas-general",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...buildPayloadBase(ops, planos, operarios, sectores),
              fecha_inicio: format(range.from, "yyyy-MM-dd"),
              fecha_fin: format(range.to, "yyyy-MM-dd"),
            }),
          }
        )
        const data = await res.json()
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.tareas)
            ? data.tareas
            : []
        setTareas(lista)
      } catch {
        setTareas([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const aplicarFiltros = useCallback(() => {
    return fetchTareas(opSel, planoSel, operarioSel, sectorSel, dateRange)
  }, [opSel, planoSel, operarioSel, sectorSel, dateRange, fetchTareas])

  const refrescarFiltros = useCallback(() => {
    setFiltrosRefreshVersion((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (loadingFiltros || initializedRef.current) return
    initializedRef.current = true
    void aplicarFiltros()
  }, [loadingFiltros, aplicarFiltros])

  useEffect(() => {
    void (async () => {
      setOpSel([])
      setPlanoSel([])
      setOperarioSel([])
      setSectorSel([])
    })()
  }, [dateRange])

  const descargarExcel = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return

    const params = new URLSearchParams({
      fecha_inicio: format(dateRange.from, "yyyy-MM-dd"),
      fecha_fin: format(dateRange.to, "yyyy-MM-dd"),
    })

    const url = `/api/reportes/descargarReporteFecha?${params}`

    try {
      const res = await fetchWithConnectionCheck(url, { method: "GET" })
      if (!res.ok) {
        throw new Error(`Error ${res.status}`)
      }

      const blob = await res.blob()
      const contentDisposition = res.headers.get("content-disposition")
      let nombreArchivo = "reporte_tareas.xlsx"

      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=([^;]+)/i)
        if (match) {
          let raw = match[1].trim()
          if (raw.startsWith('"') && raw.endsWith('"')) {
            raw = raw.slice(1, -1)
          }
          nombreArchivo = raw.includes("UTF-8''")
            ? decodeURIComponent(raw.split("''").pop() ?? raw)
            : decodeURIComponent(raw)
        }
      }

      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl
      a.download = nombreArchivo
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch {
      toast.error("No se pudo descargar el reporte")
    }
  }, [dateRange])

  return {
    filtros,
    dateRange,
    setDateRange,
    opSel,
    setOpSel,
    planoSel,
    setPlanoSel,
    operarioSel,
    setOperarioSel,
    sectorSel,
    setSectorSel,
    tareas,
    loading,
    aplicarFiltros,
    refrescarFiltros,
    descargarExcel,
  }
}

export function useTareaEditor({
  refetch,
  removeTareaLocal,
  onAfterAction,
}: MonitoreoTareaEditorProps) {
  const [tareaEditando, setTareaEditando] = useState<number | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<number | null>(null)
  const [descripcionEdit, setDescripcionEdit] = useState("")
  const [tiempoExtraEdit, setTiempoExtraEdit] = useState("00:00:00")
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
  const detaileSyncRef = useRef<typeof detalle | null>(null)

  useEffect(() => {
    if (detalle && detaileSyncRef.current !== detalle) {
      detaileSyncRef.current = detalle
      setDescripcionEdit(detalle.descripcion || "")
      setTiempoExtraEdit(detalle.tiempo_extra || "00:00:00")
    }
  }, [detalle])

  const isDirty =
    descripcionEdit !== (detalle?.descripcion || "") ||
    tiempoExtraEdit !== (detalle?.tiempo_extra || "00:00:00")

  const fetchTiempoCronometrado = useCallback(async (id: number) => {
    try {
      const res = await fetchWithConnectionCheck(
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

    const loadTiempo = async () => {
      await fetchTiempoCronometrado(tareaEditando)
    }
    void loadTiempo()

    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (
          tareaEditando !== null &&
          detalle?.estado?.toLowerCase() === "activa"
        ) {
          void (async () => {
            await fetchTiempoCronometrado(tareaEditando)
          })()
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
  }, [tareaEditando, detalle, fetchTiempoCronometrado])

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
      await onAfterAction?.()
    } catch {}
  }, [filaEliminando, refetch, removeTareaLocal, onAfterAction])

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
      refetch()
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
      await Promise.all([refetchDetalle(), fetchTiempoCronometrado(id)])
      setCronometroKey((prev) => prev + 1)
      setShowReiniciarConfirm(false)
    } catch {}
  }, [tareaEditando, fetchTiempoCronometrado, refetchDetalle])

  const resetEditor = useCallback(() => {
    setTareaEditando(null)
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

      await refetchDetalle()
      await onAfterAction?.()

      if (!esPausada) {
      } else {
        setTimeout(() => {
          fetchTiempoCronometrado(id)
        }, 500)
      }
    } catch {}
  }, [
    tareaEditando,
    detalle?.estado,
    refetchDetalle,
    fetchTiempoCronometrado,
    onAfterAction,
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
      await onAfterAction?.()
    } catch {}
  }, [tareaEditando, refetch, removeTareaLocal, onAfterAction])

  return {
    tareaEditando,
    setTareaEditando,
    filaEliminando,
    setFilaEliminando,
    descripcionEdit,
    setDescripcionEdit,
    tiempoExtraEdit,
    setTiempoExtraEdit,
    dirty: isDirty,
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
