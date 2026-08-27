"use client"

import { TextScrollArea, Selector } from "@/components/components"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"
import { useSubmoduloGuard } from "@/hooks/useSubmoduloGuard"
import { AUTORIZACIONES } from "@/lib/permisos"
import { usePanelOperarios } from "./funciones"

export default function Monitoreo() {
  const accesoPermitido = useSubmoduloGuard(AUTORIZACIONES.SUBMODULO_PANEL)
  const [busquedaOperario, setBusquedaOperario] = useState("")
  const {
    loading,
    rows,
    totales,
    estadoSeleccionado,
    setEstadoSeleccionado,
    opcionesEstado,
    updatedAt,
  } = usePanelOperarios(accesoPermitido)

  const horaActualizacion = updatedAt
    ? new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(updatedAt)
    : "pendiente"

  const rowsFiltrados = useMemo(() => {
    const query = busquedaOperario.trim().toLowerCase()

    if (!query) {
      return rows
    }

    return rows.filter((row) => {
      const texto = [
        row.nombreCompleto,
        row.numeroOp ?? "",
        row.productoSector,
        row.estado,
      ]
        .join(" ")
        .toLowerCase()

      return texto.includes(query)
    })
  }, [busquedaOperario, rows])

  const rowKeys = useMemo(
    () => rowsFiltrados.map((row) => row.key),
    [rowsFiltrados]
  )
  const mostrarLoadingEnLista = loading && rowsFiltrados.length === 0

  if (!accesoPermitido) {
    return null
  }

  return (
    <div className="flex h-full flex-1 flex-col items-center gap-5 p-5">
      <h1 className="text-xl font-bold xl:text-2xl">PANEL</h1>
      <div className="flex w-full flex-1 flex-col gap-5 bg-background1 p-5">
        <div className="flex flex-col gap-1 text-sm opacity-70">
          <p>Tabla actualizada: {horaActualizacion}</p>
          <p>Actualización automática cada minuto.</p>
        </div>

        <div className="flex w-full flex-col items-center gap-5 xl:flex-row">
          <Selector
            placeholder="SELECCIONE EL ESTADO"
            data={opcionesEstado}
            keyId="id"
            keyLabel="nombre"
            value={estadoSeleccionado}
            onValueChange={setEstadoSeleccionado}
          />

          <Input
            value={busquedaOperario}
            onChange={(event) => setBusquedaOperario(event.target.value)}
            placeholder="BUSCAR POR NOMBRE, NÚMERO OP, SECTOR O PRODUCTO"
            className="min-h-10 w-full rounded border-2 border-background6 bg-background3 px-3 py-2 text-sm focus:border-background6"
          />
        </div>

        <div className="flex w-full flex-col justify-between gap-2 opacity-70 xl:flex-row">
          <p>Operarios con tareas activas: {totales.activos}</p>
          <p>Operarios sin tareas: {totales.inactivos}</p>
        </div>

        <TextScrollArea
          tags={mostrarLoadingEnLista ? ["__loading__"] : rowKeys}
          placeholder="ESTADO DE LOS OPERARIOS"
          extraClass="flex flex-1 flex-col gap-3 rounded"
          placeholderExtraClass="xl:text-lg text-md"
          withHover={false}
          withPointer={false}
          renderItem={({ index }) => {
            if (mostrarLoadingEnLista) {
              return (
                <div className="flex w-full items-center justify-center py-4 text-sm opacity-70">
                  Cargando lista...
                </div>
              )
            }

            const row = rowsFiltrados[index]
            if (!row) return null

            return (
              <div className="flex w-full items-center justify-between gap-3 py-2">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-md">
                    {row.tieneTareaActiva
                      ? `${row.nombreCompleto} | ${row.numeroOp ?? "-"}`
                      : row.nombreCompleto}
                  </span>
                  {row.tieneTareaActiva && (
                    <span className="text-sm">{row.productoSector}</span>
                  )}
                  <span className="text-sm opacity-70">
                    Tareas en pausa: {row.tareasEnPausa}
                  </span>
                </div>
                <div className="text-center text-sm opacity-80">
                  {row.tieneTareaActiva ? (
                    <div className="flex flex-col gap-2">
                      <p className="rounded bg-greencremona/20 p-1 text-greencremona uppercase">
                        {row.estado.toUpperCase()}
                      </p>
                      <p>{`${row.tiempo}`}</p>
                    </div>
                  ) : (
                    <p className="rounded bg-orangecremona/20 p-1 text-orangecremona uppercase">
                      {row.estado.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
