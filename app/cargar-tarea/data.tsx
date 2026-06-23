import { Selector, Inputs, Textarea } from "@/components/components"
import { Cronometro, DuracionInput } from "@/components/cronometro"
import type { Sector, Producto, Labor } from "@/context/dataContext"

export const secciones = [
  {
    id: 1,
    nombre: "NUEVA TAREA",
    extraClasses:
      "bg-redcremona/60 border-redcremona border-2 hover:bg-redcremona/80",
  },
  {
    id: 2,
    nombre: "TAREAS EN CURSO",
    extraClasses:
      "bg-greencremona/60 border-greencremona border-2 hover:bg-greencremona/80",
  },
]

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
]

export function getOpcionesNuevaTarea(
  productos: Producto[],
  sectores: Sector[],
  labores: Labor[],
  sectorSeleccionado: number | null,
  setSectorSeleccionado: (id: number | null) => void,
  productoSeleccionado: number | null,
  setProductoSeleccionado: (id: number | null) => void,
  laborSeleccionada: number | null,
  setLaborSeleccionada: (id: number | null) => void,
  laborManual: string,
  setLaborManual: (value: string) => void,
  mostrarInputLabor: boolean
) {
  return [
    {
      id: 1,
      contenido: (
        <div className="flex flex-col gap-2 bg-background2">
          <h1 className="text-md flex w-full items-center font-bold">
            OPERARIO
          </h1>
          <div className="flex flex-col gap-5">
            <Selector
              placeholder="SELECCIONE EL OPERARIO"
              data={sectores}
              keyId="id_sector"
            />
            <Selector
              placeholder="SELECCIONE EL SECTOR"
              data={sectores}
              keyId="id_sector"
              value={
                sectorSeleccionado !== null
                  ? String(sectorSeleccionado)
                  : undefined
              }
              onValueChange={(value) => setSectorSeleccionado(Number(value))}
            />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      contenido: (
        <div className="flex flex-col gap-2 bg-background2">
          <h1 className="text-md flex w-full items-center font-bold">
            ORDEN DE PRODUCCION
          </h1>
          <div className="flex flex-col gap-5">
            <Inputs placeholder="NUMERO DE OP" type="number" />
            <Inputs placeholder="NUMERO DE PLANO" type="number" />
            <Selector
              placeholder="PRODUCTO"
              data={productos}
              keyId="id_producto"
              disabled={sectorSeleccionado === null}
              value={
                productoSeleccionado !== null
                  ? String(productoSeleccionado)
                  : ""
              }
              onValueChange={(value) => setProductoSeleccionado(Number(value))}
            />
            {mostrarInputLabor ? (
              <Inputs
                placeholder="TIPO DE LABOR"
                type="text"
                value={laborManual}
                onChange={(e) => setLaborManual(e.target.value)}
                disabled={productoSeleccionado === null}
              />
            ) : (
              <Selector
                placeholder="TIPO DE LABOR"
                data={labores}
                keyId="id_labor"
                disabled={productoSeleccionado === null}
                value={
                  laborSeleccionada !== null
                    ? String(laborSeleccionada)
                    : ""
                }
                onValueChange={(value) => setLaborSeleccionada(Number(value))}
              />
            )}
            <Textarea placeholder="DETALLES DE LA TAREA, OBSERVACIONES..." />
          </div>
        </div>
      ),
    },
    {
      id: 3,
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
            <Cronometro />
          </div>
        </div>
      ),
    },
  ]
}

//---------------------------------------TAREAS EN CURSO---------------------------------------//
export const tareasEnCurso = [
  { NumeroTarea: "TAREA 92: OPERARIO1 - TORRE" },
  { NumeroTarea: "TAREA 93: OPERARIO2 - TORRE" },
  { NumeroTarea: "TAREA 94: OPERARIO3 - TORRE" },
  { NumeroTarea: "TAREA 95: OPERARIO4 - TORRE" },
  { NumeroTarea: "TAREA 96: OPERARIO5 - TORRE" },
  { NumeroTarea: "TAREA 97: OPERARIO6 - TORRE" },
  { NumeroTarea: "TAREA 98: OPERARIO7 - TORRE" },
  { NumeroTarea: "TAREA 99: OPERARIO8 - TORRE" },
  { NumeroTarea: "TAREA 100: OPERARIO9 - TORRE" },
  { NumeroTarea: "TAREA 101: OPERARIO10 - TORRE" },
  { NumeroTarea: "TAREA 102: OPERARIO11 - TORRE" },
  { NumeroTarea: "TAREA 103: OPERARIO12 - TORRE" },
  { NumeroTarea: "TAREA 104: OPERARIO13 - TORRE" },
  { NumeroTarea: "TAREA 105: OPERARIO14 - TORRE" },
  { NumeroTarea: "TAREA 106: OPERARIO1 - TORRE" },
  { NumeroTarea: "TAREA 107: OPERARIO2 - TORRE" },
  { NumeroTarea: "TAREA 108: OPERARIO3 - TORRE" },
  { NumeroTarea: "TAREA 109: OPERARIO4 - TORRE" },
  { NumeroTarea: "TAREA 110: OPERARIO5 - TORRE" },
  { NumeroTarea: "TAREA 111: OPERARIO6 - TORRE" },
  { NumeroTarea: "TAREA 112: OPERARIO7 - TORRE" },
  { NumeroTarea: "TAREA 113: OPERARIO8 - TORRE" },
  { NumeroTarea: "TAREA 114: OPERARIO9 - TORRE" },
  { NumeroTarea: "TAREA 115: OPERARIO10 - TORRE" },
  { NumeroTarea: "TAREA 116: OPERARIO11 - TORRE" },
  { NumeroTarea: "TAREA 117: OPERARIO12 - TORRE" },
  { NumeroTarea: "TAREA 118: OPERARIO13 - TORRE" },
  { NumeroTarea: "TAREA 119: OPERARIO14 - TORRE" },
  { NumeroTarea: "TAREA 120: OPERARIO1 - TORRE" },
  { NumeroTarea: "TAREA 121: OPERARIO2 - TORRE" },
  { NumeroTarea: "TAREA 122: OPERARIO3 - TORRE" },
  { NumeroTarea: "TAREA 123: OPERARIO4 - TORRE" },
  { NumeroTarea: "TAREA 124: OPERARIO5 - TORRE" },
  { NumeroTarea: "TAREA 125: OPERARIO6 - TORRE" },
  { NumeroTarea: "TAREA 126: OPERARIO7 - TORRE" },
  { NumeroTarea: "TAREA 127: OPERARIO8 - TORRE" },
  { NumeroTarea: "TAREA 128: OPERARIO9 - TORRE" },
  { NumeroTarea: "TAREA 129: OPERARIO10 - TORRE" },
  { NumeroTarea: "TAREA 130: OPERARIO11 - TORRE" },
  { NumeroTarea: "TAREA 131: OPERARIO12 - TORRE" },
  { NumeroTarea: "TAREA 132: OPERARIO13 - TORRE" },
  { NumeroTarea: "TAREA 133: OPERARIO14 - TORRE" },
  { NumeroTarea: "TAREA 134: OPERARIO1 - TORRE" },
  { NumeroTarea: "TAREA 135: OPERARIO2 - TORRE" },
  { NumeroTarea: "TAREA 136: OPERARIO3 - TORRE" },
  { NumeroTarea: "TAREA 137: OPERARIO4 - TORRE" },
  { NumeroTarea: "TAREA 138: OPERARIO5 - TORRE" },
  { NumeroTarea: "TAREA 139: OPERARIO6 - TORRE" },
  { NumeroTarea: "TAREA 140: OPERARIO7 - TORRE" },
  { NumeroTarea: "TAREA 141: OPERARIO8 - TORRE" },
  { NumeroTarea: "TAREA 142: OPERARIO9 - TORRE" },
  { NumeroTarea: "TAREA 143: OPERARIO10 - TORRE" },
  { NumeroTarea: "TAREA 144: OPERARIO11 - TORRE" },
  { NumeroTarea: "TAREA 145: OPERARIO12 - TORRE" },
  { NumeroTarea: "TAREA 146: OPERARIO13 - TORRE" },
  { NumeroTarea: "TAREA 147: OPERARIO14 - TORRE" },
  { NumeroTarea: "TAREA 148: OPERARIO1 - TORRE" },
  { NumeroTarea: "TAREA 149: OPERARIO2 - TORRE" },
  { NumeroTarea: "TAREA 150: OPERARIO3 - TORRE" },
  { NumeroTarea: "TAREA 151: OPERARIO4 - TORRE" },
  { NumeroTarea: "TAREA 152: OPERARIO5 - TORRE" },
  { NumeroTarea: "TAREA 153: OPERARIO6 - TORRE" },
  { NumeroTarea: "TAREA 154: OPERARIO7 - TORRE" },
  { NumeroTarea: "TAREA 155: OPERARIO8 - TORRE" },
  { NumeroTarea: "TAREA 156: OPERARIO9 - TORRE" },
  { NumeroTarea: "TAREA 157: OPERARIO10 - TORRE" },
  { NumeroTarea: "TAREA 158: OPERARIO11 - TORRE" },
  { NumeroTarea: "TAREA 159: OPERARIO12 - TORRE" },
  { NumeroTarea: "TAREA 160: OPERARIO13 - TORRE" },
  { NumeroTarea: "TAREA 161: OPERARIO14 - TORRE" },
]
