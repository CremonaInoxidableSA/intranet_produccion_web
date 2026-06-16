"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { secciones, opcionesNuevaTarea, tareasEnCurso } from "./data";
import { DialogTemplate, EditarButton, EliminarButton, TextScrollArea } from "@/components/components";

export default function CargarTarea() {
  const [seccionActiva, setSeccionActiva] = useState<number>(1);
  const [tareaEditando, setTareaEditando] = useState<string | null>(null);

  return (
    <div className="flex h-full w-full flex-col gap-5 p-5">
      <h1 className="flex w-full justify-center text-2xl font-bold">
        CARGAR NUEVA TAREA
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-start gap-5">
        <div className="flex w-full flex-row items-center justify-center gap-5 md:w-1/3">
          {secciones.map(({ id, nombre, extraClasses }) => {
            const isActive = seccionActiva === id
            return (
              <Button
                key={id}
                onClick={() => setSeccionActiva(id)}
                className={`text-md flex flex-1 items-center justify-center rounded-md font-semibold text-white transition-all duration-200 ${
                  isActive
                    ? `${extraClasses} ring-2 ring-offset-2 ring-offset-background`
                    : `${extraClasses} text-white/70`
                }`}
              >
                {nombre}
              </Button>
            )
          })}
        </div>

        {seccionActiva === 1 &&
          opcionesNuevaTarea.map((opcion) => (
            <div
              className="w-full rounded-md bg-background2 p-5 md:w-1/3"
              key={opcion.id}
            >
              {opcion.contenido}
            </div>
          ))}

        {seccionActiva === 2 && (
          <TextScrollArea
            tags={tareasEnCurso.map((tarea) => tarea.NumeroTarea)}
            placeholder="LISTADO DE TAREAS EN CURSO"
            extraClass="bg-background2 p-5 md:w-1/3"
            placeholderExtraClass="text-xl"
            extras={(tag) => (
              <div className="flex items-center justify-end gap-2">
                <EditarButton
                  extraClass="size-6"
                  onClick={() => setTareaEditando(tag)}
                />
                <EliminarButton extraClass="size-6" onClick={() => {}} />
              </div>
            )}
          />
        )}
      </div>

      <DialogTemplate
        title={tareaEditando ?? ""}
        description="Editar los detalles de la tarea seleccionada."
        fields={
          <>
            {opcionesNuevaTarea.map((opcion) => (
              <div className="rounded-md bg-background2 p-4" key={opcion.id}>
                {opcion.contenido}
              </div>
            ))}
            <Button className="w-full border-bluecremona bg-bluecremona/80 text-white hover:bg-bluecremona">
              FINALIZAR TAREA
            </Button>
          </>
        }
        dialogClose="Cancelar"
        dialogSubmit="Guardar Cambios"
        open={tareaEditando !== null}
        onOpenChange={(open) => {
          if (!open) setTareaEditando(null)
        }}
      />
    </div>
  )
}
