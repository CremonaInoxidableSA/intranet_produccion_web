import { NextResponse } from "next/server"

const API_BASE_URL =
  process.env.API_PRODUCCION_URL ?? "http://192.168.20.151:8200"

export async function GET() {
  try {
    const [opRes, planoRes, operariosRes, sectoresRes] = await Promise.all([
      fetch(`${API_BASE_URL}/filtros/numeros-op-curso`, {
        headers: { Accept: "application/json" },
      }),
      fetch(`${API_BASE_URL}/filtros/numeros-plano-curso`, {
        headers: { Accept: "application/json" },
      }),
      fetch(`${API_BASE_URL}/filtros/listado-operarios-curso`, {
        headers: { Accept: "application/json" },
      }),
      fetch(`${API_BASE_URL}/filtros/sectores-curso`, {
        headers: { Accept: "application/json" },
      }),
    ])

    const [opData, planoData, operariosData, sectoresData] = await Promise.all([
      opRes.json(),
      planoRes.json(),
      operariosRes.json(),
      sectoresRes.json(),
    ])

    return NextResponse.json({
      numeros_op: opData.numeros_op ?? [],
      numeros_plano: planoData.numeros_plano ?? [],
      operarios: operariosData.encargados ?? [],
      sectores: sectoresData.sectores ?? [],
    })
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor" },
      { status: 500 }
    )
  }
}
