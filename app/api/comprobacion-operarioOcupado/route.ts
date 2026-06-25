import { NextResponse } from "next/server"

const API_BASE_URL =
  process.env.API_PRODUCCION_URL ?? "http://192.168.20.151:8200"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id_operario = searchParams.get("id_operario")

  try {
    const response = await fetch(
      `${API_BASE_URL}/comprobaciones/tarea-activa-operario?id_operario=${id_operario}`,
      { headers: { Accept: "application/json" } }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al consultar la API" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor" },
      { status: 500 }
    )
  }
}
