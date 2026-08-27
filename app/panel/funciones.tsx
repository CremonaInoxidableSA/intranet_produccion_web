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

const ESTADOS_PANEL = ["activa", "inactivo"]

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

export function usePanelOperarios() {
  const [listado, setListado] = useState<OperarioPanel[]>([])
  const [estadosSeleccionados, setEstadosSeleccionados] = useState<string[]>([])
  const [totales, setTotales] = useState({ activos: 0, inactivos: 0 })
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
    } catch {
      setListado([])
      setTotales({ activos: 0, inactivos: 0 })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarListado()
  }, [cargarListado])

  const listadoFiltrado = useMemo(() => {
    if (estadosSeleccionados.length === 0) {
      return listado
    }

    return listado.filter((operario) =>
      estadosSeleccionados.includes(operario.estado.toLowerCase())
    )
  }, [listado, estadosSeleccionados])

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
    estadosSeleccionados,
    setEstadosSeleccionados,
    opcionesEstado: toOptions(ESTADOS_PANEL),
  }
}
