"use client"

import { useState, useEffect, useCallback } from "react"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { type DateRange } from "react-day-picker"
import {
  useFiltrosEnCurso,
  useFiltrosFinalizadas,
  type FiltrosMonitoreo,
} from "@/context/dataGeneralContext"

// ---- Types ----

export type TareaActiva = {
  id_tarea: number
  nombre_operario_seleccionado: string
  apellido_operario_seleccionado: string
  nombre_producto: string
  nombre_labor: string
  estado: string
}

export type TareaFinalizada = {
  id_tarea: number
  nombre_operario_seleccionado: string
  apellido_operario_seleccionado: string
  nombre_producto: string
  nombre_labor: string
  estado: string
}

// ---- Helpers ----

export function toOptions(items: (string | number)[]) {
  return items.map((item) => ({ id: String(item), nombre: String(item) }))
}

function buildPayloadBase(
  ops: string[],
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

function initSelections(filtros: FiltrosMonitoreo) {
  return {
    ops: filtros.numeros_op.map(String),
    planos: filtros.numeros_plano.map(String),
    operarios: filtros.operarios.map(String),
    sectores: filtros.sectores.map(String),
  }
}

// ---- Hook: Tareas en Curso ----

export function useMonitoreoEnCurso() {
  const { filtros, loading: loadingFiltros } = useFiltrosEnCurso()

  const [opSel, setOpSel] = useState<string[]>([])
  const [planoSel, setPlanoSel] = useState<string[]>([])
  const [operarioSel, setOperarioSel] = useState<string[]>([])
  const [sectorSel, setSectorSel] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)

  const [tareas, setTareas] = useState<TareaActiva[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTareas = useCallback(
    async (
      ops: string[],
      planos: string[],
      operarios: string[],
      sectores: string[]
    ) => {
      setLoading(true)
      try {
        const res = await fetch("/api/tareas/tareas-activas-general", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            buildPayloadBase(ops, planos, operarios, sectores)
          ),
        })
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

  // Initialise selections and auto-fetch when filter options arrive
  useEffect(() => {
    if (loadingFiltros || initialized) return
    const { ops, planos, operarios, sectores } = initSelections(filtros)
    setOpSel(ops)
    setPlanoSel(planos)
    setOperarioSel(operarios)
    setSectorSel(sectores)
    setInitialized(true)
    fetchTareas(ops, planos, operarios, sectores)
  }, [filtros, loadingFiltros, initialized, fetchTareas])

  const aplicarFiltros = useCallback(() => {
    fetchTareas(opSel, planoSel, operarioSel, sectorSel)
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

// ---- Hook: Tareas Finalizadas ----

export function useMonitoreoFinalizadas() {
  const { filtros, loading: loadingFiltros } = useFiltrosFinalizadas()

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(subMonths(new Date(), 1)),
    to: endOfMonth(subMonths(new Date(), 1)),
  })

  const [opSel, setOpSel] = useState<string[]>([])
  const [planoSel, setPlanoSel] = useState<string[]>([])
  const [operarioSel, setOperarioSel] = useState<string[]>([])
  const [sectorSel, setSectorSel] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)

  const [tareas, setTareas] = useState<TareaFinalizada[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTareas = useCallback(
    async (
      ops: string[],
      planos: string[],
      operarios: string[],
      sectores: string[],
      range: DateRange | undefined
    ) => {
      if (!range?.from || !range?.to) return
      setLoading(true)
      try {
        const res = await fetch("/api/tareas/tareas-finalizadas-general", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...buildPayloadBase(ops, planos, operarios, sectores),
            fecha_inicio: format(range.from, "yyyy-MM-dd"),
            fecha_fin: format(range.to, "yyyy-MM-dd"),
          }),
        })
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

  // Initialise selections and auto-fetch when filter options arrive
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (loadingFiltros || initialized) return
    const { ops, planos, operarios, sectores } = initSelections(filtros)
    setOpSel(ops)
    setPlanoSel(planos)
    setOperarioSel(operarios)
    setSectorSel(sectores)
    setInitialized(true)
    fetchTareas(ops, planos, operarios, sectores, dateRange)
  }, [filtros, loadingFiltros, initialized, fetchTareas])

  const aplicarFiltros = useCallback(() => {
    fetchTareas(opSel, planoSel, operarioSel, sectorSel, dateRange)
  }, [opSel, planoSel, operarioSel, sectorSel, dateRange, fetchTareas])

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
  }
}
