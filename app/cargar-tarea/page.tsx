"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { secciones, opcionesNuevaTarea, tareasEnCurso } from "./data"
import {
  AlertDialogTemplate,
  DialogTemplate,
} from "@/components/componentsClient"
import {
  TextScrollArea,
} from "@/components/components"

export default function CargarTarea() {
  const [seccionActiva, setSeccionActiva] = useState<number>(1)
  const [tareaEditando, setTareaEditando] = useState<string | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<string | null>(null)

  return (
    <div className="flex h-full w-full flex-col gap-5 p-5">
      <h1 className="flex w-full justify-center text-2xl font-bold">
        CARGAR NUEVA TAREA
      </h1>

      {/* Botones de sección — solo visibles en mobile */}
      <div className="flex w-full flex-row items-center justify-center gap-5 md:hidden">
        {secciones.map(({ id, nombre, extraClasses }) => {
          const isActive = seccionActiva === id
          return (
            <Button
              key={id}
              onClick={() => setSeccionActiva(id)}
              className={`text-md flex flex-1 items-center justify-center rounded-md font-semibold text-white transition-all duration-200 ${
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

      <div className="flex h-full w-full flex-col items-center justify-start gap-20 md:flex-row md:items-start">
        {/* Sección 1 — mobile: solo si activa | desktop: siempre visible */}
        <div
          className={`w-full md:flex md:w-1/2 md:flex-col md:gap-5 ${seccionActiva === 1 ? "flex flex-col gap-5" : "hidden"}`}
        >
          {/* Título de columna solo en desktop */}
          <h2 className="hidden w-full justify-center text-lg font-semibold md:flex">
            {secciones.find((s) => s.id === 1)?.nombre}
          </h2>
          {opcionesNuevaTarea.map((opcion) => (
            <div
              className="w-full rounded-md bg-background2 p-5"
              key={opcion.id}
            >
              {opcion.contenido}
            </div>
          ))}
        </div>

        {/* Sección 2 — mobile: solo si activa | desktop: siempre visible */}
        <div
          className={`w-full md:flex md:w-1/2 md:flex-col md:gap-5 ${seccionActiva === 2 ? "flex flex-col gap-5" : "hidden"}`}
        >
          {/* Título de columna solo en desktop */}
          <h2 className="hidden w-full justify-center text-lg font-semibold md:flex ">
            {secciones.find((s) => s.id === 2)?.nombre}
          </h2>
          <TextScrollArea
            tags={tareasEnCurso.map((tarea) => tarea.NumeroTarea)}
            placeholder="LISTADO DE TAREAS EN CURSO"
            extraClass="bg-background2 p-5"
            placeholderExtraClass="text-xl"
            onTagClick={(tag) => setTareaEditando(tag)}
            height="h-screen"
          />
        </div>
      </div>

      <DialogTemplate
        title={tareaEditando ?? ""}
        description="Editar los detalles de la tarea seleccionada."
        fields={opcionesNuevaTarea.map((opcion) => (
          <div className="rounded-md bg-background2 p-4" key={opcion.id}>
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
              ELIMINAR TAREA
            </Button>
            <div className="flex w-full flex-row items-center justify-end gap-5">
              <Button className="border-bluecremona bg-bluecremona/50 text-white hover:bg-bluecremona">
                FINALIZAR TAREA
              </Button>
              <Button className="border-redcremona bg-redcremona/50 text-white hover:bg-redcremona">
                GUARDAR CAMBIOS
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
