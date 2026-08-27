"use client"

import { TextScrollArea, SelectorConBusqueda } from "@/components/components"
import { useMemo } from "react"
import { useSubmoduloGuard } from "@/hooks/useSubmoduloGuard"
import { AUTORIZACIONES } from "@/lib/permisos"
import { usePanelOperarios } from "./funciones"

export default function Monitoreo() {
  const accesoPermitido = useSubmoduloGuard(AUTORIZACIONES.SUBMODULO_PANEL)
  const {
    loading,
    rows,
    totales,
    estadosSeleccionados,
    setEstadosSeleccionados,
    opcionesEstado,
  } = usePanelOperarios()

  const rowKeys = useMemo(() => rows.map((row) => row.key), [rows])

  if (!accesoPermitido) {
    return null
  }

  return (
    <div className="flex h-full flex-1 flex-col items-center gap-5 p-5">
      <h1 className="text-xl font-bold xl:text-2xl">PANEL</h1>
      <div className="flex w-full flex-1 flex-col gap-5 bg-background1 p-5">
        <SelectorConBusqueda
          placeholder="SELECCIONE EL ESTADO"
          searchPlaceholder="ESTADO..."
          data={opcionesEstado}
          keyId="id"
          keyLabel="nombre"
          values={estadosSeleccionados}
          onValuesChange={setEstadosSeleccionados}
        />

        <div className="flex flex-row justify-between opacity-70">
          <p>Operarios con tareas activas: {totales.activos}</p>
          <p>Operarios sin tareas: {totales.inactivos}</p>
        </div>

        {loading && <p className="text-sm opacity-70">Cargando panel...</p>}

        <TextScrollArea
          tags={rowKeys}
          placeholder="ESTADO DE LOS USUARIOS"
          extraClass="flex flex-1 flex-col gap-3 rounded"
          placeholderExtraClass="xl:text-lg text-md"
          withHover={false}
          withPointer={false}
          renderItem={({ index }) => {
            const row = rows[index]
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
