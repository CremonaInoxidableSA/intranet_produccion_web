"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { fetchWithConnectionCheck } from "@/lib/connectionManager"

export type OperarioPanel = {
  nombre_operario: string
  apellido_operario: string
  numero_tareas_pausa: number
  estado: string
  numero_op?: number
  sector?: string
  producto?: string
  tiempo_cronometrado?: string
}

type ListaPanelResponse = {
  operarios?: OperarioPanel[]
  total_operarios_activos?: number
  total_operarios_inactivos?: number
}

export type OperarioPanelRow = {
  key: string
  nombreCompleto: string
  numeroOp?: number
  productoSector: string
  tareasEnPausa: number
  estado: string
  tiempo: string
  tieneTareaActiva: boolean
}

const ESTADOS_PANEL = [
  { id: "__all__", nombre: "TODOS" },
  { id: "activa", nombre: "ACTIVA" },
  { id: "inactivo", nombre: "INACTIVA" },
]

export function toOptions(items: (string | number)[]) {
  return items.map((item) => ({ id: String(item), nombre: String(item) }))
}

function esActivo(estado: string) {
  return estado.toLowerCase().includes("activa")
}

function mapOperarioToRow(
  operario: OperarioPanel,
  index: number
): OperarioPanelRow {
  const nombreCompleto = `${operario.nombre_operario} ${operario.apellido_operario}`
  const tieneTareaActiva = esActivo(operario.estado)

  return {
    key: `${nombreCompleto}-${index}`,
    nombreCompleto,
    numeroOp: operario.numero_op,
    productoSector: `${operario.producto ?? "Sin producto"} | ${operario.sector ?? "Sin sector"}`,
    tareasEnPausa: operario.numero_tareas_pausa ?? 0,
    estado: operario.estado,
    tiempo: operario.tiempo_cronometrado ?? "00:00:00",
    tieneTareaActiva,
  }
}

export function usePanelOperarios(enabled = true) {
  const [listado, setListado] = useState<OperarioPanel[]>([])
  const [estadoSeleccionado, setEstadoSeleccionado] =
    useState<string>("__all__")
  const [totales, setTotales] = useState({ activos: 0, inactivos: 0 })
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)

  const cargarListado = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetchWithConnectionCheck(
        "/api/listas/lista-panel",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )

      const data = (await response.json()) as ListaPanelResponse
      const operarios = Array.isArray(data?.operarios) ? data.operarios : []

      setListado(operarios)
      setTotales({
        activos:
          typeof data?.total_operarios_activos === "number"
            ? data.total_operarios_activos
            : operarios.filter((operario) => esActivo(operario.estado)).length,
        inactivos:
          typeof data?.total_operarios_inactivos === "number"
            ? data.total_operarios_inactivos
            : operarios.filter((operario) => !esActivo(operario.estado)).length,
      })
      setUpdatedAt(new Date())
    } catch {
      setListado([])
      setTotales({ activos: 0, inactivos: 0 })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const initialLoadTimeout = window.setTimeout(() => {
      void cargarListado()
    }, 0)

    return () => window.clearTimeout(initialLoadTimeout)
  }, [cargarListado, enabled])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const intervalId = window.setInterval(() => {
      void cargarListado()
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [cargarListado, enabled])

  const listadoFiltrado = useMemo(() => {
    if (!estadoSeleccionado || estadoSeleccionado === "__all__") {
      return listado
    }

    return listado.filter(
      (operario) => operario.estado.toLowerCase() === estadoSeleccionado
    )
  }, [listado, estadoSeleccionado])

  const rows = useMemo(
    () =>
      listadoFiltrado.map((operario, index) =>
        mapOperarioToRow(operario, index)
      ),
    [listadoFiltrado]
  )

  return {
    loading,
    rows,
    totales,
    estadoSeleccionado,
    setEstadoSeleccionado,
    opcionesEstado: ESTADOS_PANEL,
    updatedAt,
  }
}
