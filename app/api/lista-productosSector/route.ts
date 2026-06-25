import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL ?? "http://192.168.20.151:8200"

export async function GET(request: NextRequest) {
  const id_sector = request.nextUrl.searchParams.get("id_sector")

  if (!id_sector) {
    return NextResponse.json(
      { error: "El parámetro id_sector es requerido" },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/productos/lista-productos-sector?id_sector=${id_sector}`,
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
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor" },
      { status: 500 }
    )
  }
}
