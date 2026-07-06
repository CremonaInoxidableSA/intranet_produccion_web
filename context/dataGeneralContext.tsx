"use client"

import { useCallback, useEffect, useState } from "react"

//------------------------------------CARGAR NUEVA TAREA------------------------------------//

export type Sector = {
  id_sector: number
  nombre: string
}

export function useSectores() {
  const [sectores, setSectores] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/listas/lista-sectores")
        if (!response.ok) throw new Error("Error al obtener sectores")
        const data: Sector[] = await response.json()
        setSectores(data)
      } catch {
        setError("No se pudo cargar la lista de sectores")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { sectores, loading, error }
}

export type ProductoSector = {
  id_producto: number
  nombre: string
}

export function useProductosSector(id_sector: number | null) {
  const [productos, setProductos] = useState<ProductoSector[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id_sector === null) return
    async function fetchData() {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/listas/lista-productosSector?id_sector=${id_sector}`
        )
        if (!response.ok) throw new Error("Error al obtener productos")
        const data: ProductoSector[] = await response.json()
        setProductos(data)
      } catch {
        setError("No se pudo cargar la lista de productos")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id_sector])

  return { productos, loading, error }
}

export type Producto = {
  id_producto: number
  nombre: string
  sectores: string[]
}

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/listas/lista-productos")
      if (!response.ok) throw new Error("Error al obtener productos")
      const data: Producto[] = await response.json()
      setProductos(data)
    } catch {
      setError("No se pudo cargar la lista de productos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { productos, loading, error, refetch: fetchData }
}

export type Labor = {
  id_labor: number
  nombre: string
}

export function useLabores(
  id_sector: number | null,
  id_producto: number | null
) {
  const [labores, setLabores] = useState<Labor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id_sector === null || id_producto === null) {
      setLabores([])
      return
    }
    async function fetchData() {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/listas/lista-labores?id_sector=${id_sector}&id_producto=${id_producto}`
        )
        if (!response.ok) throw new Error("Error al obtener labores")
        const data: Labor[] = await response.json()
        setLabores(data)
      } catch {
        setError("No se pudo cargar la lista de labores")
        setLabores([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id_sector, id_producto])

  return { labores, loading, error }
}

export type Operario = {
  id_operario: number
  nombre: string
  apellido: string
  nombre_completo: string
  legajo: number
  rol_nombre: string
  rol_display: string
}

const ROL_DISPLAY: Record<string, string> = {
  "encargado-produccion": "ENCARGADO",
  operario: "OPERARIO",
}

export function useOperarios() {
  const [operarios, setOperarios] = useState<Operario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/listas/lista-operarios")
      if (!response.ok) throw new Error("Error al obtener operarios")
      const data = await response.json()
      const operariosFormateados = data.map(
        (o: {
          id_operario: number
          nombre: string
          apellido: string
          legajo: number
          rol_nombre: string
        }) => ({
          ...o,
          nombre_completo: `${o.apellido} ${o.nombre}`,
          rol_display: ROL_DISPLAY[o.rol_nombre] ?? o.rol_nombre.toUpperCase(),
        })
      )
      setOperarios(operariosFormateados)
    } catch {
      setError("No se pudo cargar la lista de operarios")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { operarios, loading, error, refetch: fetchData }
}
