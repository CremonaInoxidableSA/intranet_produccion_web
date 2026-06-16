import { Selector, TablaEdicion } from "@/components/components";
import { Button } from "@/components/ui/button";
import { Inputs } from "@/components/components";

const Datos = Array.from({ length: 10 }).map((_) => ({
  NOMBRE_APELLIDO: "Ricardo Arjona",
  LEGAJO: "1192",
  SECTOR: "MECANICO",
  ROL: "SUPERVISOR",
}));

const Opciones = [
  {
    id: 1,
    className: "md:w-1/4",
    contenido: (
      <div className="flex flex-col gap-2 bg-background2">
        <h1 className="flex w-full items-center text-xl font-bold">
          CARGAR NUEVO OPERARIO
        </h1>
        <div className="flex flex-col gap-5">
          <Inputs placeholder="NOMBRE Y APELLIDO" type="number" />
          <Inputs placeholder="LEGAJO" type="input" />
          <Selector placeholder="SECTOR" />
          <Selector placeholder="ROL" />
          <Button className="w-full bg-bluecremona hover:bg-bluecremona/80">
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
        <TablaEdicion columns={["NOMBRE_APELLIDO", "LEGAJO", "SECTOR", "ROL"]} data={Datos} />
      </div>
    ),
  },
]

export default function Registros() {
  return (
    <div className="h-full w-full flex flex-col p-5 gap-5">
      <h1 className="w-full flex justify-center text-xl font-bold">
        LISTADO DE OPERARIOS
      </h1>
      <div className="w-full flex flex-row justify-center gap-5 items-start">
        {Opciones.map(({ id, className, contenido }) => (
          <div key={id} className={`bg-background2 ${className} rounded-md p-5`}>
            {contenido}
          </div>
        ))}
      </div>
    </div>
  );
}
