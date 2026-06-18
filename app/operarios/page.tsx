"use client"

import { useState } from "react"
import {
  TablaEdicion,
  DialogTemplate,
  AlertDialogTemplate,
} from "@/components/componentsClient"
import { Selector, Inputs, EliminarButton } from "@/components/components"
import { Button } from "@/components/ui/button"

const Datos = Array.from({ length: 10 }).map(() => ({
  NOMBRE_APELLIDO: "Ricardo Arjona",
  LEGAJO: "1192",
}))

export default function Operarios() {
  const [filaEditando, setFilaEditando] = useState<Record<
    string,
    string
  > | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<Record<
    string,
    string
  > | null>(null)

  return (
    <div className="flex h-full w-full flex-col gap-5 p-5">
      <h1 className="flex w-full justify-center text-xl font-bold">
        LISTADO DE OPERARIOS
      </h1>
      <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row md:items-start">
        {/* Panel izquierdo */}
        <div className="w-full rounded-md bg-background2 p-5 md:w-1/4">
          <div className="flex flex-col gap-2 bg-background2">
            <h1 className="flex w-full items-center text-xl font-bold">
              CARGAR NUEVO OPERARIO
            </h1>
            <div className="flex flex-col gap-5">
              <Inputs placeholder="NOMBRE Y APELLIDO" type="text" />
              <Inputs placeholder="LEGAJO" type="text" />
              <Selector placeholder="SECTOR" />
              <Selector placeholder="ROL" />
              <Button className="w-full bg-bluecremona hover:bg-bluecremona/80">
                CARGAR OPERARIO
              </Button>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="w-full rounded-md bg-background2 p-5 md:w-2/3 xl:w-1/3">
          <h1 className="flex w-full items-center text-xl font-bold">
            REGISTROS
          </h1>
          <TablaEdicion
            columns={["NOMBRE_APELLIDO", "LEGAJO"]}
            data={Datos}
            onClickEdit={(row) => setFilaEditando(row)}
          />
        </div>
      </div>

      {/* Dialog edición */}
      <DialogTemplate
        open={filaEditando !== null}
        onOpenChange={(open) => {
          if (!open) setFilaEditando(null)
        }}
        title={`Editar: ${filaEditando?.NOMBRE_APELLIDO ?? ""}`}
        description="Modificá los datos del operario."
        fields={
          <>
            <Inputs placeholder="NOMBRE Y APELLIDO" type="text" />
            <Inputs placeholder="LEGAJO" type="text" />
            <Selector placeholder="SECTOR" />
            <Selector placeholder="ROL" />
          </>
        }
        dialogFooter={
          <div className="flex w-full flex-row items-center justify-between gap-5">
            <Button className="border-red-600 bg-red-600/50 text-white hover:bg-red-600">
              ELIMINAR
            </Button>
            <Button className="border-redcremona bg-redcremona/50 text-white hover:bg-redcremona">
              GUARDAR
            </Button>
          </div>
        }
      />

      {/* Dialog confirmación eliminación */}
      <AlertDialogTemplate
        open={filaEliminando !== null}
        onOpenChange={(open) => {
          if (!open) setFilaEliminando(null)
        }}
        title="¿Eliminar operario?"
        description={`Esta acción no se puede deshacer. Se eliminará a ${filaEliminando?.NOMBRE_APELLIDO ?? ""}.`}
        onConfirm={() => {
          // lógica de eliminación
          setFilaEliminando(null)
        }}
      />
    </div>
  )
}
