import { id } from "date-fns/locale"
import { useEffect, useState } from "react"

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
        const response = await fetch("/api/lista-sectores")

        if (!response.ok) throw new Error("Error al obtener sectores")

        const data: Sector[] = await response.json()
        setSectores(data)
      } catch (err) {
        setError("No se pudo cargar la lista de sectores")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { sectores, loading, error }
}

export type Producto = {
  id_producto: number
  nombre: string
}

export function useProductos(id_sector: number | null) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id_sector === null) return

    async function fetchData() {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/lista-productos?id_sector=${id_sector}`
        )

        if (!response.ok) throw new Error("Error al obtener productos")

        const data: Producto[] = await response.json()
        setProductos(data)
      } catch (err) {
        setError("No se pudo cargar la lista de productos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id_sector])

  return { productos, loading, error }
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
          `/api/lista-labores?id_sector=${id_sector}&id_producto=${id_producto}`
        )

        if (!response.ok) {
          throw new Error("Error al obtener labores")
        }

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