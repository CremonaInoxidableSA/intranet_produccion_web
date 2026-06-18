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
    <div className="flex h-full w-full flex-col gap-2 p-5">
      <h1 className="flex w-full justify-center text-xl font-bold">
        PRODUCTOS
      </h1>
      <div className="items-strech flex w-full flex-col justify-center gap-5 xl:h-[76vh] xl:flex-row">
        <div className="self-strech flex flex-col gap-2 rounded bg-background2 p-5 xl:w-1/3">
          <TextScrollArea
            tags={Datos.map((dato) => dato)}
            placeholder="LISTADO DE PRODUCTOS"
            extraClass="p-5 border"
            placeholderExtraClass="md:text-xl text-md"
            height="xl:h-[34vh] h-96"
            extras={(dato) => (
              <EliminarButton
                extraClass="size-6"
                onClick={() => setFilaEliminando(dato)}
              />
            )}
          />
          <h1 className="flex w-full items-center text-xl font-bold">
            CARGAR NUEVO PRODUCTO
          </h1>
          <div className="flex h-full w-full flex-col justify-between">
            <Inputs placeholder="NOMBRE" type="text" />
            <Selector placeholder="SECTORES" />
            <GuardarButton placeholder="CREAR NUEVO PRODUCTO" />
          </div>
        </div>

        <div className="self-strech flex flex-col gap-2 rounded bg-background2 p-5 xl:w-1/3">
          <TextScrollArea
            tags={Datos.map((dato) => dato)}
            placeholder="LISTADO DE LABORES - {Producto-seleccionado}"
            extraClass="p-5 border"
            placeholderExtraClass="md:text-xl text-md"
            height="xl:h-[34vh] h-96"
            extras={(dato) => (
              <EliminarButton
                extraClass="size-6"
                onClick={() => setFilaEliminando(dato)}
              />
            )}
          />
          <h1 className="flex w-full items-center text-xl font-bold">
            CARGAR NUEVO LABOR
          </h1>
          <div className="flex h-full w-full flex-col justify-between">
            <Inputs placeholder="NOMBRE LABOR" type="text" />
            <Inputs placeholder="PRODUCTO" type="text" />
            <Selector placeholder="SECTOR" />
            <GuardarButton placeholder="CREAR NUEVO LABOR" />
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
