import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL =
  process.env.API_PRODUCCION_URL ?? "http://192.168.20.151:8200"

export async function GET(request: NextRequest) {
  const id_producto = request.nextUrl.searchParams.get("id_producto")

  if (!id_producto) {
    return NextResponse.json(
      { error: "El parámetro id_producto es requerido" },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/labores/lista-labores-producto?id_producto=${id_producto}`,
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
