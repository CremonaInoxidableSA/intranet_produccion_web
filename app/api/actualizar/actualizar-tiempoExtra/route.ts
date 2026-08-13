import { NextResponse } from "next/server"
import { getBearerTokenFromRequest } from "@/app/api/_utils/authApi"
const API_BASE_URL =
  process.env.API_PRODUCCION_URL ?? "http://192.168.20.151:8200"

export async function PUT(request: Request) {
  const token = getBearerTokenFromRequest(request)

  if (!token) {
    return NextResponse.json(
      { error: "No autorizado: falta el token" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { id_tarea, tiempo_extra } = body
    if (!id_tarea || tiempo_extra === undefined) {
      return NextResponse.json(
        { error: "Faltan parámetros: id_tarea y tiempo_extra" },
        { status: 400 }
      )
    }
    const response = await fetch(
      `${API_BASE_URL}/tareas/actualizar-tiempo-extra?id_tarea=${id_tarea}&tiempo_extra=${encodeURIComponent(tiempo_extra)}`,
      {
        method: "PUT",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      }
    )
    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Error al actualizar tiempo extra" },
        { status: response.status }
      )
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor" },
      { status: 500 }
    )
  }
}
