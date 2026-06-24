"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { secciones, tareasEnCurso, opcionesTarea } from "./data"
import {
  AlertDialogTemplate,
  DialogTemplate, 
  DateRangePicker,
} from "@/components/componentsClient"
import { TextScrollArea, EliminarButton, Selector } from "@/components/components"
import { useSectores } from "@/context/dataGeneralContext"

export default function CargarTarea() {
  const [tareaEditando, setTareaEditando] = useState<string | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<string | null>(null)
  const [seccionActiva, setSeccionActiva] = useState<number>(1)
  const { sectores } = useSectores()
  
  
  const etiquetasTareas = tareasEnCurso.map(
    (t) => `${t.numeroTarea} - ${t.operario} - ${t.torre}`
  )
  
  return (
    <div className="flex flex-1 flex-col items-center p-5">
      <h1 className="text-xl font-bold xl:text-2xl mb-5">MONITOREO</h1>
      {/* Botones de sección — solo visibles en mobile */}
      <div className="flex w-full flex-row items-center justify-center gap-5 xl:hidden">
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

      <div className="flex w-full flex-1 flex-col gap-5">
        {/* Sección FILTROS — siempre visible */}
        <div className="flex w-full flex-col gap-2 rounded bg-background2 p-5">
          <h1 className="text-md font-bold xl:text-lg">FILTRO DE DATOS</h1>

          <div className="flex w-full flex-col items-center justify-between gap-3 xl:flex-row">
            <DateRangePicker />
            <Selector
              placeholder="NUMERO DE OP"
              data={sectores}
              keyId="id_sector"
            />
            <Selector
              placeholder="NUMERO DE PLANO"
              data={sectores}
              keyId="id_sector"
            />
            <Selector
              placeholder="ENCARGADO"
              data={sectores}
              keyId="id_sector"
            />
            <Selector placeholder="SECTOR" data={sectores} keyId="id_sector" />
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col xl:flex-row xl:gap-5">
          {/* Sección 1 — mobile: solo si activa | desktop: siempre visible */}
          <div
            className={`${
              seccionActiva === 1 ? "flex" : "hidden"
            } flex-col xl:flex xl:w-1/2`}
          >
            <TextScrollArea
              tags={etiquetasTareas}
              placeholder="TAREAS INICIADAS"
              extraClass="flex flex-1 flex-col gap-3 rounded bg-background2 p-5"
              placeholderExtraClass="xl:text-lg text-md"
              onTagClick={(tag) => setTareaEditando(tag)}
              extras={(dato) => (
                <EliminarButton
                  extraClass="size-6"
                  onClick={() => setFilaEliminando(dato)}
                />
              )}
            />
          </div>

          {/* Sección 2 — mobile: solo si activa | desktop: siempre visible */}
          <div
            className={`${
              seccionActiva === 2 ? "flex" : "hidden"
            } flex-col xl:flex xl:w-1/2`}
          >
            <TextScrollArea
              tags={etiquetasTareas}
              placeholder="TAREAS FINALIZADAS"
              extraClass="flex flex-1 flex-col gap-3 rounded bg-background2 p-5"
              placeholderExtraClass="xl:text-lg text-md"
              onTagClick={(tag) => setTareaEditando(tag)}
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

      <DialogTemplate
        title={""}
        description="Editar los detalles de la tarea seleccionada."
        fields={opcionesTarea.map((opcion) => (
          <div className="w-full rounded bg-background2 p-4" key={opcion.id}>
            {opcion.contenido}
          </div>
        ))}
        dialogFooter={
          <div className="flex w-full flex-row items-center justify-between">
            <Button
              className="border-red-600 bg-red-600/50 text-white hover:bg-red-600"
              onClick={() => {}}
            >
              ELIMINAR
            </Button>
            <Button className="border-redcremona bg-redcremona/50 text-white hover:bg-redcremona">
              GUARDAR
            </Button>
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
