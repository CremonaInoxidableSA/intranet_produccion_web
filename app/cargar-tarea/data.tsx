import { Selector, Inputs, Textarea } from "@/components/components";
import { TimePicker } from "@/components/componentsClient";
import Cronometro from "./cronometro";

export const secciones = [
  {
    id: 1,
    nombre: "NUEVA TAREA",
    extraClasses: "bg-redcremona/60 border-redcremona border-2",
  },
  {
    id: 2,
    nombre: "TAREAS EN CURSO",
    extraClasses: "bg-greencremona/60 border-greencremona border-2",
  },
];

export const ordenDeProduccion = [
  { id: 1, placerholder: "NUMERO DE OP", type: "number" },
  { id: 2, placerholder: "NUMERO DE PLANO", type: "number" },
  { id: 3, placerholder: "PRODUCTO", type: "select" },
  { id: 4, placerholder: "TIPO DE LABOR", type: "text" },
  {
    id: 5,
    placerholder: "DETALLES DE LA TAREA, OBSERVACIONES...",
    type: "textarea",
  },
];

export function renderField(input: {
  id: number;
  placerholder: string;
  type: string;
}) {
  if (input.type === "select")
    return <Selector key={input.id} placeholder={input.placerholder} />;
  if (input.type === "textarea")
    return <Textarea key={input.id} placeholder={input.placerholder} />;
  return (
    <Inputs key={input.id} placeholder={input.placerholder} type={input.type} />
  );
}

export const opcionesNuevaTarea = [
  {
    id: 1,
    contenido: (
      <div className="flex flex-col bg-background2 gap-2">
        <h1 className="w-full flex text-xl font-bold items-center">OPERARIO</h1>
        <div className="flex flex-col gap-5">
          <Selector placeholder="SELECCIONE EL OPERARIO" />
          <Selector placeholder="SELECCIONE EL SECTOR" />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    contenido: (
      <div className="flex flex-col bg-background2 gap-2">
        <h1 className="w-full flex text-xl font-bold items-center">
          ORDEN DE PRODUCCION
        </h1>
        <div className="flex flex-col gap-5">
          {ordenDeProduccion.map(renderField)}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    contenido: (
      <div className="flex flex-col bg-background2 gap-2">
        <h1 className="w-full flex text-xl font-bold items-center">
          TIEMPO EXTRA
        </h1>
        <p className="text-sm opacity-60">
          Agregado al tiempo cronometrado, por si el operario realizó alguna
          parte de la tarea fuera del horario cronometrado
        </p>
        <TimePicker />
      </div>
    ),
  },
  {
    id: 4,
    contenido: (
      <div className="flex flex-col bg-background2 gap-2">
        <h1 className="w-full flex text-xl font-bold items-center">
          CRONOMETRO
        </h1>
        <Cronometro />
      </div>
    ),
  },
];



//---------------------------------------TAREAS EN CURSO---------------------------------------//
export const tareasEnCurso = [
  { "NumeroTarea": "TAREA 92: OPERARIO1 - TORRE" },
  { "NumeroTarea": "TAREA 93: OPERARIO2 - TORRE" },
  { "NumeroTarea": "TAREA 94: OPERARIO3 - TORRE" },
  { "NumeroTarea": "TAREA 95: OPERARIO4 - TORRE" },
  { "NumeroTarea": "TAREA 96: OPERARIO5 - TORRE" },
  { "NumeroTarea": "TAREA 97: OPERARIO6 - TORRE" },
  { "NumeroTarea": "TAREA 98: OPERARIO7 - TORRE" },
  { "NumeroTarea": "TAREA 99: OPERARIO8 - TORRE" },
  { "NumeroTarea": "TAREA 100: OPERARIO9 - TORRE" },
  { "NumeroTarea": "TAREA 101: OPERARIO10 - TORRE" },
  { "NumeroTarea": "TAREA 102: OPERARIO11 - TORRE" },
  { "NumeroTarea": "TAREA 103: OPERARIO12 - TORRE" },
  { "NumeroTarea": "TAREA 104: OPERARIO13 - TORRE" },
  { "NumeroTarea": "TAREA 105: OPERARIO14 - TORRE" },
]