// app/api/actualizar-tarea/route.ts
import { NextResponse } from "next/server"

const API_BASE_URL =
  process.env.API_PRODUCCION_URL ?? "http://192.168.20.151:8200"

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id_tarea, descripcion, tiempo_extra } = body

    // Convertir tiempo_extra (segundos) a HH:MM:SS
    const horas = Math.floor(tiempo_extra / 3600)
    const minutos = Math.floor((tiempo_extra % 3600) / 60)
    const segundos = tiempo_extra % 60
    const tiempoExtraStr = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`

    const response = await fetch(`${API_BASE_URL}/tareas/actualizar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_tarea,
        descripcion,
        tiempo_extra: tiempoExtraStr,
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al actualizar" },
        { status: response.status }
      )
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
