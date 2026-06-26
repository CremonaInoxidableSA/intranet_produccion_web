import { Selector, Inputs, Textarea } from "@/components/components"
import { CronometroCreacion, DuracionInput } from "@/components/cronometro"
import type {
  Sector,
  Producto,
  Labor,
  Operario,
} from "@/context/dataGeneralContext"

export function getOpcionesNuevaTarea(
  productos: Producto[],
  sectores: Sector[],
  labores: Labor[],
  operarios: Operario[],
  sectorSeleccionado: number | null,
  setSectorSeleccionado: (id: number | null) => void,
  productoSeleccionado: number | null,
  setProductoSeleccionado: (id: number | null) => void,
  operarioSeleccionado: number | null,
  setOperarioSeleccionado: (id: number | null) => void,
  laborSeleccionada: number | null,
  setLaborSeleccionada: (id: number | null) => void,
  laborManual: string,
  setLaborManual: (value: string) => void,
  mostrarInputLabor: boolean,
  numeroOp: number | null,
  setNumeroOp: (v: number | null) => void,
  numeroPlano: number | null,
  setNumeroPlano: (v: number | null) => void,
  descripcion: string,
  setDescripcion: (v: string) => void,
  tiempoExtra: string,
  setTiempoExtra: (v: string) => void,
  formularioCompleto: boolean,
  onCrearTarea: () => Promise<void>
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
              data={operarios}
              keyId="id_operario"
              keyLabel="nombre_completo"
              value={
                operarioSeleccionado !== null
                  ? String(operarioSeleccionado)
                  : ""
              }
              onValueChange={(value) => setOperarioSeleccionado(Number(value))}
            />
            <Selector
              placeholder="SELECCIONE EL SECTOR"
              data={sectores}
              keyId="id_sector"
              value={
                sectorSeleccionado !== null ? String(sectorSeleccionado) : ""
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
            <Inputs
              placeholder="NUMERO DE OP"
              type="number"
              value={numeroOp !== null ? String(numeroOp) : ""}
              onChange={(e) => setNumeroOp(Number(e.target.value))}
            />
            <Inputs
              placeholder="NUMERO DE PLANO"
              type="number"
              value={numeroPlano !== null ? String(numeroPlano) : ""}
              onChange={(e) => setNumeroPlano(Number(e.target.value))}
            />
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
                  laborSeleccionada !== null ? String(laborSeleccionada) : ""
                }
                onValueChange={(value) => setLaborSeleccionada(Number(value))}
              />
            )}
            <Textarea
              placeholder="DETALLES DE LA TAREA, OBSERVACIONES..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
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
            <DuracionInput value={tiempoExtra} onChange={setTiempoExtra} />
          </div>
          <div className="flex flex-col gap-2 bg-background2">
            <h1 className="text-md flex w-full items-center font-bold">
              CRONOMETRO
            </h1>
            <CronometroCreacion
              disabled={!formularioCompleto}
              onConfirmar={onCrearTarea}
            />
          </div>
        </div>
      ),
    },
  ]
}
