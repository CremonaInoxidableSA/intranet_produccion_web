import { Inputs } from "@/components/components"
import { CronometroEdicion, DuracionInput } from "@/components/cronometro"

export const secciones = [
  {
    id: 1,
    nombre: "TAREAS INICIADAS",
    extraClasses:
      "bg-redcremona/60 border-redcremona border-2 hover:bg-redcremona/80",
  },
  {
    id: 2,
    nombre: "TAREAS FINALIZADAS",
    extraClasses:
      "bg-greencremona/60 border-greencremona border-2 hover:bg-greencremona/80",
  },
]

export const opcionesTarea = [
  {
    id: 1,
    contenido: <Inputs type="date" placeholder="Fecha de inicio" />,
  },
  {
    id: 2,
    contenido: <Inputs type="date" placeholder="Fecha de inicio" />,
  },
  {
    id: 3,
    contenido: <Inputs type="date" placeholder="Fecha de inicio" />,
  },
  {
    id: 4,
    contenido: <Inputs type="date" placeholder="Fecha de inicio" />,
  },
  {
    id: 5,
    contenido: <Inputs type="date" placeholder="Fecha de inicio" />,
  },
  {
    id: 6,
    contenido: <Inputs type="date" placeholder="Fecha de inicio" />,
  },
  {
    id: 7,
    contenido: <Inputs type="date" placeholder="Fecha de inicio" />,
  },
  {
    id: 8,
    contenido: <Inputs type="date" placeholder="Fecha de inicio" />,
  },
  {
    id: 9,
    contenido: <Inputs type="date" placeholder="Fecha de inicio" />,
  },
  {
    id: 10,
    contenido: (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 bg-background2">
          <h1 className="text-md flex w-full items-center font-bold">
            TIEMPO EXTRA
          </h1>
          <p className="text-sm opacity-60">
            Agregado al tiempo cronometrado, por si el operario realizó alguna
            parte de la tarea fuera del horario cronometrado
          </p>
          <DuracionInput />
        </div>
        <div className="flex flex-col gap-2 bg-background2">
          <h1 className="text-md flex w-full items-center font-bold">
            CRONOMETRO
          </h1>
          <CronometroEdicion value="00:00:00" />
        </div>
      </div>
    ),
  },
]

//---------------------------------------TAREAS EN CURSO---------------------------------------//
export const tareasEnCurso = [
  { id: 1, numeroTarea: "TAREA 1", operario: "USUARIO1", torre: "TORRE" },
  { id: 2, numeroTarea: "TAREA 2", operario: "USUARIO1", torre: "TORRE" },
  { id: 3, numeroTarea: "TAREA 3", operario: "USUARIO1", torre: "TORRE" },
  { id: 4, numeroTarea: "TAREA 4", operario: "USUARIO1", torre: "TORRE" },
  { id: 5, numeroTarea: "TAREA 5", operario: "USUARIO1", torre: "TORRE" },
  { id: 6, numeroTarea: "TAREA 6", operario: "USUARIO1", torre: "TORRE" },
  { id: 7, numeroTarea: "TAREA 7", operario: "USUARIO1", torre: "TORRE" },
  { id: 8, numeroTarea: "TAREA 8", operario: "USUARIO1", torre: "TORRE" },
  { id: 9, numeroTarea: "TAREA 9", operario: "USUARIO1", torre: "TORRE" },
  { id: 10, numeroTarea: "TAREA 10", operario: "USUARIO1", torre: "TORRE" },
  { id: 11, numeroTarea: "TAREA 11", operario: "USUARIO1", torre: "TORRE" },
  { id: 12, numeroTarea: "TAREA 12", operario: "USUARIO1", torre: "TORRE" },
  { id: 13, numeroTarea: "TAREA 13", operario: "USUARIO1", torre: "TORRE" },
  { id: 14, numeroTarea: "TAREA 14", operario: "USUARIO1", torre: "TORRE" },
  { id: 15, numeroTarea: "TAREA 15", operario: "USUARIO1", torre: "TORRE" },
  { id: 16, numeroTarea: "TAREA 16", operario: "USUARIO1", torre: "TORRE" },
  { id: 17, numeroTarea: "TAREA 17", operario: "USUARIO1", torre: "TORRE" },
  { id: 18, numeroTarea: "TAREA 18", operario: "USUARIO1", torre: "TORRE" },
  { id: 29, numeroTarea: "TAREA 19", operario: "USUARIO1", torre: "TORRE" },
  { id: 20, numeroTarea: "TAREA 20", operario: "USUARIO1", torre: "TORRE" },
  { id: 21, numeroTarea: "TAREA 21", operario: "USUARIO1", torre: "TORRE" },
  { id: 22, numeroTarea: "TAREA 22", operario: "USUARIO1", torre: "TORRE" },
  { id: 23, numeroTarea: "TAREA 23", operario: "USUARIO1", torre: "TORRE" },
  { id: 24, numeroTarea: "TAREA 24", operario: "USUARIO1", torre: "TORRE" },
  { id: 25, numeroTarea: "TAREA 25", operario: "USUARIO1", torre: "TORRE" },
  { id: 26, numeroTarea: "TAREA 26", operario: "USUARIO1", torre: "TORRE" },
  { id: 27, numeroTarea: "TAREA 27", operario: "USUARIO1", torre: "TORRE" },
  { id: 28, numeroTarea: "TAREA 28", operario: "USUARIO1", torre: "TORRE" },
  { id: 29, numeroTarea: "TAREA 29", operario: "USUARIO1", torre: "TORRE" },
  { id: 30, numeroTarea: "TAREA 30", operario: "USUARIO1", torre: "TORRE" },
  { id: 31, numeroTarea: "TAREA 31", operario: "USUARIO1", torre: "TORRE" },
  { id: 32, numeroTarea: "TAREA 32", operario: "USUARIO1", torre: "TORRE" },
  { id: 33, numeroTarea: "TAREA 33", operario: "USUARIO1", torre: "TORRE" },
  { id: 34, numeroTarea: "TAREA 34", operario: "USUARIO1", torre: "TORRE" },
  { id: 35, numeroTarea: "TAREA 35", operario: "USUARIO1", torre: "TORRE" },
  { id: 36, numeroTarea: "TAREA 36", operario: "USUARIO1", torre: "TORRE" },
  { id: 37, numeroTarea: "TAREA 37", operario: "USUARIO1", torre: "TORRE" },
  { id: 38, numeroTarea: "TAREA 38", operario: "USUARIO1", torre: "TORRE" },
  { id: 39, numeroTarea: "TAREA 39", operario: "USUARIO1", torre: "TORRE" },
]
