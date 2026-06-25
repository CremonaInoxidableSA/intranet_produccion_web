"use client"

import { useState } from "react"
import { AlertDialogTemplate } from "@/components/componentsClient"
import {
  BotonIcono,
  TextScrollArea,
  Inputs,
  Selector,
  Boton,
} from "@/components/components"
import { useSectores } from "@/context/dataGeneralContext"
import { Trash2 } from "lucide-react"

const Datos = Array.from({ length: 50 }).map(
  (_, i, a) => `Mesa ${a.length - i}`
)

export default function Productos() {
  const [filaEliminando, setFilaEliminando] = useState<string | null>(null)
  const { sectores } = useSectores()

  return (
    <div className="flex h-500 flex-col items-center justify-center gap-2 p-5 xl:flex-1">
      <h1 className="flex w-full justify-center text-xl font-bold">
        PRODUCTOS
      </h1>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-5 xl:h-[76vh] xl:w-6/7 xl:flex-row">
        {/* Columna 1 */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 rounded bg-background2 p-5 xl:w-1/3">
          <TextScrollArea
            tags={Datos.map((dato) => dato)}
            placeholder="LISTADO DE PRODUCTOS"
            extraClass="flex-1 min-h-0 p-5 border"
            placeholderExtraClass="md:text-xl text-md"
            extras={(dato) => (
              <BotonIcono
                icono={Trash2}
                extraClass="size-6"
                onClick={() => setFilaEliminando(dato)}
              />
            )}
          />
          <h1 className="flex w-full shrink-0 items-center text-xl font-bold">
            CARGAR NUEVO PRODUCTO
          </h1>
          <div className="flex w-full shrink-0 flex-col justify-between gap-5">
            <Inputs placeholder="NOMBRE" type="text" />
            <Selector
              placeholder="SECTORES"
              data={sectores}
              keyId="id_sector"
            />
            <Boton placeholder="CREAR NUEVO PRODUCTO" />
          </div>
        </div>

        {/* Columna 2 */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 rounded bg-background2 p-5 xl:w-1/3">
          <TextScrollArea
            tags={Datos.map((dato) => dato)}
            placeholder="LISTADO DE LABORES - {Producto-seleccionado}"
            extraClass="flex-1 min-h-0 p-5 border"
            placeholderExtraClass="md:text-xl text-md"
            extras={(dato) => (
              <BotonIcono
                icono={Trash2}
                extraClass="size-6"
                onClick={() => setFilaEliminando(dato)}
              />
            )}
          />
          <h1 className="flex w-full shrink-0 items-center text-xl font-bold">
            CARGAR NUEVO LABOR
          </h1>
          <div className="flex w-full shrink-0 flex-col justify-between gap-5">
            <Inputs placeholder="NOMBRE LABOR" type="text" />
            <Inputs placeholder="PRODUCTO" type="text" />
            <Selector placeholder="SECTOR" data={sectores} keyId="id_sector" />
            <Boton placeholder="CREAR NUEVO LABOR" />
          </div>
        </div>
      </div>

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
