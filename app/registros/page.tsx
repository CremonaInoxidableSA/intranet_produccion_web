import { Selector } from "@/components/components"
import { DateRangePicker } from "@/components/componentsClient"
import { Button } from "@/components/ui/button"
import { Tabla } from "@/components/components"

const Datos = Array.from({ length: 10 }).map(() => ({
  OP: "851-5871AQB",
  PLANO: "MESA RECTANGULAR",
  OPERARIO: "Ricardo Arjona",
  FECHA: "20-01-2024",
}))

const Opciones = [
  {
    id: 1,
    className: "md:w-1/4",
    contenido: (
      <div className="flex flex-col gap-2 bg-background2">
        <h1 className="flex w-full items-center text-xl font-bold">
          FILTRO DE DATOS
        </h1>
        <div className="flex flex-col gap-5">
          <DateRangePicker placeholder="SELECCIONE EL RANGO DE FECHAS" />
          <Selector placeholder="SELECCIONE EL NUMERO DE OP" />
          <Selector placeholder="SELECCIONE EL NUMERO DE PLANO" />
          <Button className="w-full border border-bluecremona bg-bluecremona/90 text-white hover:bg-bluecremona/80">
            APLICAR FILTRO
          </Button>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    className: "md:w-2/3",
    contenido: (
      <div className="flex flex-col gap-2 bg-background2">
        <h1 className="flex w-full items-center text-xl font-bold">
          REGISTROS
        </h1>
        <p className="flex w-full items-center text-sm opacity-60">
          DD-MM-AAAA
        </p>
        <Tabla columns={["OP", "PLANO", "OPERARIO", "FECHA"]} data={Datos} />
      </div>
    ),
  },
]

export default function Registros() {
  return (
    <div className="flex h-full w-full flex-col gap-5 p-5">
      <h1 className="flex w-full justify-center text-xl font-bold">
        LISTADO DE REGISTROS
      </h1>
      <div className="flex w-full flex-col md:flex-row items-start justify-center gap-5">
        {Opciones.map(({ id, className, contenido }) => (
          <div
            key={id}
            className={`w-full bg-background2 ${className} rounded p-5`}
          >
            {contenido}
          </div>
        ))}
      </div>
    </div>
  )
}
