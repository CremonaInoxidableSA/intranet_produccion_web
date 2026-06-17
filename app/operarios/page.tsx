"use client"

import { useState } from "react"
import {
  TablaEdicion,
  DialogTemplate,
  AlertDialogTemplate,
} from "@/components/componentsClient"
import { Selector, Inputs } from "@/components/components"
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
      <div className="flex w-full flex-col md:flex-row items-center md:items-start justify-center gap-5">
        {/* Panel izquierdo */}
        <div className="rounded-md bg-background2 p-5 md:w-1/4">
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
        <div className="rounded-md bg-background2 p-5 md:w-2/3 xl:w-1/3">
          <h1 className="flex w-full items-center text-xl font-bold">
            REGISTROS
          </h1>
          <TablaEdicion
            columns={["NOMBRE_APELLIDO", "LEGAJO"]}
            data={Datos}
            onClickEdit={(row) => setFilaEditando(row)}
            onClickDelete={(row) => setFilaEliminando(row)}
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
        dialogClose="Cancelar"
        dialogSubmit="Guardar"
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
