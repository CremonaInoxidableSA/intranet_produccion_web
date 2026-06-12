"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { secciones, opcionesNuevaTarea, tareasEnCurso } from "./data";
import { PencilLine, Trash2 } from "lucide-react";

export default function CargarTarea() {
  const [seccionActiva, setSeccionActiva] = useState<number>(1);
  const [tareaEditando, setTareaEditando] = useState<string | null>(null);

  return (
    <div className="h-full w-full flex flex-col p-5 gap-5">
      <h1 className="w-full flex justify-center text-2xl font-bold">
        CARGAR NUEVA TAREA
      </h1>
      <div className="h-full w-full flex flex-col items-center justify-start gap-5">
        <div className="flex flex-row w-full md:w-1/3 gap-5 justify-center items-center">
          {secciones.map(({ id, nombre, extraClasses }) => {
            const isActive = seccionActiva === id;
            return (
              <Button
                key={id}
                onClick={() => setSeccionActiva(id)}
                className={`flex-1 rounded-md flex text-md font-semibold justify-center items-center text-white transition-all duration-200 ${
                  isActive
                    ? `${extraClasses} ring-2 ring-offset-2 ring-offset-background`
                    : `${extraClasses} text-white/70`
                }`}
              >
                {nombre}
              </Button>
            );
          })}
        </div>

        {seccionActiva === 1 &&
          opcionesNuevaTarea.map((opcion) => (
            <div
              className="bg-background2 w-full md:w-1/3 rounded-md p-5"
              key={opcion.id}
            >
              {opcion.contenido}
            </div>
          ))}

        {seccionActiva === 2 && (
          <div className="flex flex-col gap-3 bg-background2 w-full h-full md:w-1/3 rounded-md p-5">
            <h1 className="w-full flex text-xl font-bold items-center">
              LISTADO DE TAREAS EN CURSO
            </h1>
            <div className="flex flex-col gap-3 h-160 overflow-y-auto">
              {tareasEnCurso.map((tarea) => (
                <div
                  className="flex flex-row justify-between items-center bg-background3 w-full rounded-md px-5 py-2"
                  key={tarea.NumeroTarea}
                >
                  {tarea.NumeroTarea}
                  <div className="flex gap-2 items-center justify-end">
                    <PencilLine
                      className="text-blue-500 cursor-pointer size-6 aspect-square h-full items-center justify-center"
                      onClick={() => setTareaEditando(tarea.NumeroTarea)}
                    />
                    <Trash2 className="text-red-500 cursor-pointer size-6 aspect-square h-full items-center justify-center" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={tareaEditando !== null}
        onOpenChange={(open) => {
          if (!open) setTareaEditando(null);
        }}
      >
        <form>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{tareaEditando}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto scrollbar-gutter-stable pr-1">
              {opcionesNuevaTarea.map((opcion) => (
                <div className="bg-background2 rounded-md p-4" key={opcion.id}>
                  {opcion.contenido}
                </div>
              ))}
              <Button className="w-full bg-bluecremona/80 border-bluecremona hover:bg-bluecremona text-white">
                FINALIZAR TAREA
              </Button>
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
