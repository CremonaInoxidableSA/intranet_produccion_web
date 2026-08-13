import { NextResponse } from "next/server"
import { getBearerTokenFromRequest } from "@/app/api/_utils/authApi"
const API_BASE_URL =
  process.env.API_PRODUCCION_URL ?? "http://192.168.20.151:8200"

export async function GET(request: Request) {
  const token = getBearerTokenFromRequest(request)

  if (!token) {
    return NextResponse.json(
      { error: "No autorizado: falta el token" },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const fecha_inicio = searchParams.get("fecha_inicio")
  const fecha_fin = searchParams.get("fecha_fin")

  try {
    const response = await fetch(
      `${API_BASE_URL}/reportes/descargar-reporte-fecha?fecha_inicio_filtrado=${fecha_inicio}&fecha_fin_filtrado=${fecha_fin}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al consultar la API" },
        { status: response.status }
      )
    }

    const fileBuffer = await response.arrayBuffer()
    const contentType =
      response.headers.get("content-type") ??
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    const contentDisposition =
      response.headers.get("content-disposition") ??
      `attachment; filename="reporte_${fecha_inicio}_${fecha_fin}.xlsx"`

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    })
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor" },
      { status: 500 }
    )
  }
}
