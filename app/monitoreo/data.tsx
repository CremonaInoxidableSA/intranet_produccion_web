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
