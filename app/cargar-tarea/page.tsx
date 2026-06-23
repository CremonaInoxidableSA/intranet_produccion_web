"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { secciones, getOpcionesNuevaTarea, tareasEnCurso } from "./data"
import {
  AlertDialogTemplate,
  DialogTemplate,
} from "@/components/componentsClient"
import { TextScrollArea } from "@/components/components"
import { useSectores, useProductos, useLabores } from "@/context/dataContext"

export default function CargarTarea() {
  const [seccionActiva, setSeccionActiva] = useState<number>(1)
  const [tareaEditando, setTareaEditando] = useState<string | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<string | null>(null)

  const [sectorSeleccionado, setSectorSeleccionadoState] = useState<
    number | null
  >(null)

  const [productoSeleccionado, setProductoSeleccionadoState] = useState<
    number | null
  >(null)

  const [laborSeleccionada, setLaborSeleccionada] = useState<number | null>(
    null
  )

  const [laborManual, setLaborManual] = useState("")

  const setSectorSeleccionado = (id: number | null) => {
    setSectorSeleccionadoState(id)

    setProductoSeleccionadoState(null)
    setLaborSeleccionada(null)
    setLaborManual("")
  }

  const setProductoSeleccionado = (id: number | null) => {
    setProductoSeleccionadoState(id)

    setLaborSeleccionada(null)
    setLaborManual("")
  }
  
  const { sectores } = useSectores()
  const { productos } = useProductos(sectorSeleccionado)
  const { labores } = useLabores(sectorSeleccionado, productoSeleccionado)

  const productoActual = productos.find(
    (p) => p.id_producto === productoSeleccionado
  )

  const esOtros = productoActual?.nombre.trim().toLowerCase() === "otros"

  const mostrarInputLabor = esOtros || labores.length === 0

  const opciones = getOpcionesNuevaTarea(
    productos,
    sectores,
    labores,
    sectorSeleccionado,
    setSectorSeleccionado,
    productoSeleccionado,
    setProductoSeleccionado,
    laborSeleccionada,
    setLaborSeleccionada,
    laborManual,
    setLaborManual,
    mostrarInputLabor
  )

  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="flex w-full justify-center text-xl font-bold md:text-2xl">
        CARGAR NUEVA TAREA
      </h1>

      <div className="my-5 flex w-full flex-row items-center justify-center gap-5 md:hidden">
        {secciones.map(({ id, nombre, extraClasses }) => {
          const isActive = seccionActiva === id
          return (
            <Button
              key={id}
              onClick={() => setSeccionActiva(id)}
              className={`flex flex-1 items-center justify-center rounded font-semibold text-white transition-all duration-200 ${
                isActive
                  ? `${extraClasses} ring-1 ring-offset-1 ring-offset-foreground`
                  : `${extraClasses} opacity-50`
              }`}
            >
              {nombre}
            </Button>
          )
        })}
      </div>

      <div className="flex flex-col md:flex-row md:gap-20">
        <div
          className={`w-full md:flex md:w-1/2 md:flex-col md:gap-5 ${seccionActiva === 1 ? "flex flex-col gap-5" : "hidden"}`}
        >
          <h2 className="hidden w-full justify-center text-lg font-semibold md:flex">
            {secciones.find((s) => s.id === 1)?.nombre}
          </h2>
          <div className="flex flex-1 flex-col gap-5 md:justify-between">
            {opciones.map((opcion) => (
              <div
                className="w-full rounded bg-background2 p-5"
                key={opcion.id}
              >
                {opcion.contenido}
              </div>
            ))}
          </div>
        </div>

        <div
          className={`md:flex md:w-1/2 md:flex-col md:gap-5 ${seccionActiva === 2 ? "flex flex-col gap-5" : "hidden"}`}
        >
          <h2 className="hidden justify-center text-lg font-semibold md:flex">
            {secciones.find((s) => s.id === 2)?.nombre}
          </h2>
          <TextScrollArea
            tags={tareasEnCurso.map((tarea) => tarea.NumeroTarea)}
            placeholder="LISTADO DE TAREAS EN CURSO"
            extraClass="bg-background2 p-5 flex-1"
            placeholderExtraClass="text-md"
            onTagClick={(tag) => setTareaEditando(tag)}
            height="xl:h-[89vh] md:h-[196vh] h-96"
          />
        </div>
      </div>

      <DialogTemplate
        title={tareaEditando ?? ""}
        description="Editar los detalles de la tarea seleccionada."
        fields={opciones.map((opcion) => (
          <div className="w-full rounded bg-background2 p-4" key={opcion.id}>
            {opcion.contenido}
          </div>
        ))}
        dialogFooter={
          <div className="flex w-full flex-row items-center justify-between">
            <Button
              className="border-red-600 bg-red-600/50 text-white hover:bg-red-600"
              onClick={() => {
                setFilaEliminando(tareaEditando)
                setTareaEditando(null)
              }}
            >
              ELIMINAR
            </Button>
            <div className="flex w-full flex-row items-center justify-end gap-5">
              <Button className="border-bluecremona bg-bluecremona/50 text-white hover:bg-bluecremona">
                FINALIZAR
              </Button>
              <Button className="border-redcremona bg-redcremona/50 text-white hover:bg-redcremona">
                GUARDAR
              </Button>
            </div>
          </div>
        }
        open={tareaEditando !== null}
        onOpenChange={(open) => {
          if (!open) setTareaEditando(null)
        }}
      />

      <AlertDialogTemplate
        open={filaEliminando !== null}
        onOpenChange={(open) => {
          if (!open) setFilaEliminando(null)
        }}
        title="¿Eliminar tarea?"
        description={`Esta acción no se puede deshacer. Se eliminará la tarea ${filaEliminando ?? ""}.`}
        onConfirm={() => setFilaEliminando(null)}
      />
    </div>
  )
}
