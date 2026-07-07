import { NextResponse } from "next/server"

const API_BASE_URL =
  process.env.API_PRODUCCION_URL ?? "http://192.168.20.151:8200"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const fecha_inicio = searchParams.get("fecha_inicio")
  const fecha_fin = searchParams.get("fecha_fin")

  try {
    const response = await fetch(
      `${API_BASE_URL}/reportes/descargar-reporte-fecha?fecha_inicio_filtrado=${fecha_inicio}&fecha_fin_filtrado=${fecha_fin}`,
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
