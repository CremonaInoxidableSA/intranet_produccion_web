import { Selector } from "@/components/components";
import { DateRangePicker } from "@/components/componentsClient";
import { Button } from "@/components/ui/button";
import { Tabla } from "@/components/components";

const Datos = Array.from({ length: 10 }).map((_) => ({
  OP: "851-5871AQB",
  OPERARIO: "Ricardo Arjona",
}));

const Opciones = [
  {
    id: 1,
    contenido: (
      <div className="flex flex-col bg-background2 gap-2">
        <h1 className="w-full flex text-xl font-bold items-center">
          FILTRO DE DATOS
        </h1>
        <div className="flex flex-col gap-5 ">
          <DateRangePicker placeholder="SELECCIONE EL RANGO DE FECHAS" />
          <Selector placeholder="SELECCIONE EL NUMERO DE OP" />
          <Selector placeholder="SELECCIONE EL NUMERO DE PLANO" />
          <Button className="w-full bg-bluecremona hover:bg-bluecremona/80">
            APLICAR FILTRO
          </Button>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    contenido: (
      <div className="flex flex-col bg-background2 gap-2">
        <h1 className="w-full flex text-xl font-bold items-center">
          REGISTROS
        </h1>
        <p className="w-full flex text-sm items-center opacity-60">
          DD-MM-AAAA
        </p>
        <Tabla columns={["OP", "OPERARIO"]} data={Datos} />
      </div>
    ),
  },
];

export default function Registros() {
  return (
    <div className="h-full w-full flex flex-col p-5 gap-5">
      <h1 className="w-full flex justify-center text-xl font-bold">
        LISTADO DE REGISTROS
      </h1>
      <div className="w-full flex flex-row justify-center gap-5 items-start">
        {Opciones.map(({ id, contenido }) => (
          <div key={id} className={`bg-background2 w-1/4 rounded-md p-5`}>
            {contenido}
          </div>
        ))}
      </div>
    </div>
  );
}
