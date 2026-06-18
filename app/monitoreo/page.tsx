"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { secciones, tareasEnCurso } from "./data"
import {
  AlertDialogTemplate,
  DialogTemplate,
} from "@/components/componentsClient"
import { TextScrollArea, EliminarButton, Inputs, Selector, GuardarButton } from "@/components/components"

export default function CargarTarea() {
  const [seccionActiva, setSeccionActiva] = useState<number>(1)
  const [tareaEditando, setTareaEditando] = useState<string | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<string | null>(null)

  const etiquetasTareas = tareasEnCurso.map(
    (t) => `${t.numeroTarea} - ${t.operario} - ${t.torre}`
  )
  
  return (
    <div className="flex flex-1 flex-col items-center p-5">
      <h1 className="text-xl font-bold xl:text-2xl">MONITOREO</h1>

      {/* Botones de sección — solo visibles en mobile */}
      <div className="my-5 flex w-full flex-row items-center justify-center gap-5 xl:hidden">
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

      <div className="flex w-full flex-1 flex-col xl:flex-row xl:gap-20">
        {/* Sección 1 — mobile: solo si activa | desktop: siempre visible */}
        <div
          className={`${
            seccionActiva === 1 ? "flex" : "hidden"
          } flex-col xl:flex xl:w-1/2`}
        >
          {/* Título de columna solo en desktop */}
          <h2 className="hidden justify-center text-lg font-semibold xl:flex">
            {secciones.find((s) => s.id === 1)?.nombre}
          </h2>
          <div className="flex flex-1 flex-col gap-5 rounded bg-background2 p-5">
            <>
              <h1 className="text-md font-bold xl:text-lg">FILTRO DE DATOS</h1>
              <div className="flex h-full w-full flex-col justify-between gap-3">
                <Selector placeholder="NUMERO DE OP" />
                <Selector placeholder="NUMERO DE PLANO" />
                <Selector placeholder="ENCARGADO" />
                <Selector placeholder="SECTOR" />
              </div>
            </>
            <TextScrollArea
              tags={etiquetasTareas}
              placeholder="TAREAS ACTIVAS"
              extraClass="p-5 border"
              placeholderExtraClass="xl:text-lg text-md"
              height="xl:h-[34vh] h-96"
              extras={(dato) => (
                <EliminarButton
                  extraClass="size-6"
                  onClick={() => setFilaEliminando(dato)}
                />
              )}
            />
          </div>
        </div>

        {/* Sección 2 — mobile: solo si activa | desktop: siempre visible */}
        <div
          className={`${
            seccionActiva === 2 ? "flex" : "hidden"
          } flex-col xl:flex xl:w-1/2`}
        >
          {/* Título de columna solo en desktop */}
          <h2 className="hidden justify-center text-lg font-semibold xl:flex">
            {secciones.find((s) => s.id === 2)?.nombre}
          </h2>
          <div className="flex flex-1 flex-col gap-5 rounded bg-background2 p-5">
            <>
              <h1 className="text-md font-bold xl:text-lg">FILTRO DE DATOS</h1>
              <div className="flex h-full w-full flex-col justify-between gap-3">
                <Selector placeholder="NUMERO DE OP" />
                <Selector placeholder="NUMERO DE PLANO" />
                <Selector placeholder="ENCARGADO" />
                <Selector placeholder="SECTOR" />
              </div>
            </>
            <TextScrollArea
              tags={etiquetasTareas}
              placeholder="TAREAS ACTIVAS"
              extraClass="p-5 border"
              placeholderExtraClass="xl:text-lg text-md"
              height="xl:h-[34vh] h-96"
              extras={(dato) => (
                <EliminarButton
                  extraClass="size-6"
                  onClick={() => setFilaEliminando(dato)}
                />
              )}
            />
          </div>
        </div>
      </div>

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
