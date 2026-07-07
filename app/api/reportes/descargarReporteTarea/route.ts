import { NextResponse } from "next/server"

const API_BASE_URL =
  process.env.API_PRODUCCION_URL ?? "http://192.168.20.151:8200"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id_tarea = searchParams.get("id_tarea")

  try {
    const response = await fetch(
      `${API_BASE_URL}/reportes/descargar-reporte-tarea?id_tarea=${id_tarea}`
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
      `attachment; filename="tarea_${id_tarea}.xlsx"`

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
