import { Selector, Inputs, Textarea } from "@/components/components"

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

export function renderField(input: {
  id: number
  placerholder: string
  type: string
}) {
  if (input.type === "select")
    return <Selector key={input.id} placeholder={input.placerholder} />
  if (input.type === "textarea")
    return <Textarea key={input.id} placeholder={input.placerholder} />
  return (
    <Inputs key={input.id} placeholder={input.placerholder} type={input.type} />
  )
}

//---------------------------------------TAREAS EN CURSO---------------------------------------//
export const tareasEnCurso = [
  { id: 1, numeroTarea: "TAREA 1", operario: "OPERARIO1", torre: "TORRE" },
  { id: 2, numeroTarea: "TAREA 2", operario: "OPERARIO1", torre: "TORRE" },
  { id: 3, numeroTarea: "TAREA 3", operario: "OPERARIO1", torre: "TORRE" },
  { id: 4, numeroTarea: "TAREA 4", operario: "OPERARIO1", torre: "TORRE" },
  { id: 5, numeroTarea: "TAREA 5", operario: "OPERARIO1", torre: "TORRE" },
  { id: 6, numeroTarea: "TAREA 6", operario: "OPERARIO1", torre: "TORRE" },
  { id: 7, numeroTarea: "TAREA 7", operario: "OPERARIO1", torre: "TORRE" },
  { id: 8, numeroTarea: "TAREA 8", operario: "OPERARIO1", torre: "TORRE" },
  { id: 9, numeroTarea: "TAREA 9", operario: "OPERARIO1", torre: "TORRE" },
  { id: 10, numeroTarea: "TAREA 10", operario: "OPERARIO1", torre: "TORRE" },
  { id: 11, numeroTarea: "TAREA 11", operario: "OPERARIO1", torre: "TORRE" },
  { id: 12, numeroTarea: "TAREA 12", operario: "OPERARIO1", torre: "TORRE" },
  { id: 13, numeroTarea: "TAREA 13", operario: "OPERARIO1", torre: "TORRE" },
  { id: 14, numeroTarea: "TAREA 14", operario: "OPERARIO1", torre: "TORRE" },
  { id: 15, numeroTarea: "TAREA 15", operario: "OPERARIO1", torre: "TORRE" },
  { id: 16, numeroTarea: "TAREA 16", operario: "OPERARIO1", torre: "TORRE" },
  { id: 17, numeroTarea: "TAREA 17", operario: "OPERARIO1", torre: "TORRE" },
  { id: 18, numeroTarea: "TAREA 18", operario: "OPERARIO1", torre: "TORRE" },
  { id: 29, numeroTarea: "TAREA 19", operario: "OPERARIO1", torre: "TORRE" },
  { id: 20, numeroTarea: "TAREA 20", operario: "OPERARIO1", torre: "TORRE" },
  { id: 21, numeroTarea: "TAREA 21", operario: "OPERARIO1", torre: "TORRE" },
  { id: 22, numeroTarea: "TAREA 22", operario: "OPERARIO1", torre: "TORRE" },
  { id: 23, numeroTarea: "TAREA 23", operario: "OPERARIO1", torre: "TORRE" },
  { id: 24, numeroTarea: "TAREA 24", operario: "OPERARIO1", torre: "TORRE" },
  { id: 25, numeroTarea: "TAREA 25", operario: "OPERARIO1", torre: "TORRE" },
  { id: 26, numeroTarea: "TAREA 26", operario: "OPERARIO1", torre: "TORRE" },
  { id: 27, numeroTarea: "TAREA 27", operario: "OPERARIO1", torre: "TORRE" },
  { id: 28, numeroTarea: "TAREA 28", operario: "OPERARIO1", torre: "TORRE" },
  { id: 29, numeroTarea: "TAREA 29", operario: "OPERARIO1", torre: "TORRE" },
  { id: 30, numeroTarea: "TAREA 30", operario: "OPERARIO1", torre: "TORRE" },
  { id: 31, numeroTarea: "TAREA 31", operario: "OPERARIO1", torre: "TORRE" },
  { id: 32, numeroTarea: "TAREA 32", operario: "OPERARIO1", torre: "TORRE" },
  { id: 33, numeroTarea: "TAREA 33", operario: "OPERARIO1", torre: "TORRE" },
  { id: 34, numeroTarea: "TAREA 34", operario: "OPERARIO1", torre: "TORRE" },
  { id: 35, numeroTarea: "TAREA 35", operario: "OPERARIO1", torre: "TORRE" },
  { id: 36, numeroTarea: "TAREA 36", operario: "OPERARIO1", torre: "TORRE" },
  { id: 37, numeroTarea: "TAREA 37", operario: "OPERARIO1", torre: "TORRE" },
  { id: 38, numeroTarea: "TAREA 38", operario: "OPERARIO1", torre: "TORRE" },
  { id: 39, numeroTarea: "TAREA 39", operario: "OPERARIO1", torre: "TORRE" },
]