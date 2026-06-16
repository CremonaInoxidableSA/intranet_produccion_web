"use client"

import { useState } from "react"
import { AlertDialogTemplate } from "@/components/componentsClient"
import { EliminarButton, TextScrollArea, Inputs, Selector, GuardarButton } from "@/components/components"

const Datos = Array.from({ length: 50 }).map(
  (_, i, a) => `Mesa ${a.length - i}`
)

export default function Operarios() {
  const [filaEliminando, setFilaEliminando] = useState<string | null>(null)

  return (
    <div className="flex h-full w-full flex-col gap-5 p-5">
      <h1 className="flex w-full justify-center text-xl font-bold">
        PRODUCTOS
      </h1>
      <div className="flex w-full flex-col items-center justify-center gap-5">
        <TextScrollArea
          tags={Datos.map((dato) => dato)}
          placeholder="LISTADO DE PRODUCTOS"
          extraClass="bg-background2 p-5 md:w-1/3"
          placeholderExtraClass="text-xl"
          height="h-100"
          extras={(dato) => (
            <div className="flex items-center justify-end gap-2">
              <EliminarButton
                extraClass="size-6"
                onClick={() => setFilaEliminando(dato)}
              />
            </div>
          )}
        />
        <TextScrollArea
          tags={Datos.map((dato) => dato)}
          placeholder="LISTADO DE LABORES"
          extraClass="bg-background2 p-5 md:w-1/3"
          placeholderExtraClass="text-xl"
          height="h-100"
          extras={(dato) => (
            <div className="flex items-center justify-end gap-2">
              <EliminarButton
                extraClass="size-6"
                onClick={() => setFilaEliminando(dato)}
              />
            </div>
          )}
        />
        <div className="flex flex-col gap-2 bg-background2">
          <h1 className="flex w-full items-center text-xl font-bold">
            CARGAR NUEVO PRODUCTO
          </h1>
          <div className="flex flex-col gap-5">
            <Inputs placeholder="NOMBRE Y APELLIDO" type="text" />
            <Inputs placeholder="LEGAJO" type="text" />
            <Selector placeholder="SECTOR" />
            <Selector placeholder="ROL" />
            <ButtonGuardar className="w-full bg-bluecremona hover:bg-bluecremona/80"
              
            >
              
          </div>
        </div>
      </div>

      {/* Dialog confirmación eliminación */}
      <AlertDialogTemplate
        open={filaEliminando !== null}
        onOpenChange={(open) => {
          if (!open) setFilaEliminando(null)
        }}
        title="¿Eliminar producto?"
        description={`Esta acción no se puede deshacer. Se eliminará el producto ${filaEliminando ?? ""}.`}
        onConfirm={() => {
          setFilaEliminando(null)
        }}
      />
    </div>
  )
}
