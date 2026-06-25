import { NextResponse } from "next/server"

const API_BASE_URL =
  process.env.API_PRODUCCION_URL ?? "http://192.168.20.151:8200"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const requiredFields = [
      "id_usuario_logeado",
      "id_operario_seleccionado",
      "id_sector",
      "numero_op",
      "numero_plano",
      "id_producto",
      "nombre_labor",
      "descripcion",
      "tiempo_extra",
    ]
    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json(
          { error: `Falta el campo requerido: ${field}` },
          { status: 400 }
        )
      }
    }

    const response = await fetch(`${API_BASE_URL}/tareas/crear-tarea`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Error al crear la tarea" },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error en /api/crear-tarea:", error)
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor" },
      { status: 500 }
    )
  }
}