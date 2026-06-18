import { FaRegFileExcel } from "react-icons/fa"
import { BsFiletypeSql } from "react-icons/bs"
import { BsFiletypeCsv } from "react-icons/bs"

const estilosIconos = "h-12 w-12"

const opciones = [
  {
    id: 1,
    nombre: "BACKUP SQL",
    icono: <BsFiletypeSql className={estilosIconos} />,
  },
  {
    id: 2,
    nombre: "BACKUP CSV (RAW)",
    icono: <BsFiletypeCsv className={estilosIconos} />,
  },
  {
    id: 3,
    nombre: "EXCEL MASTER",
    icono: <FaRegFileExcel className={estilosIconos} />,
  },
]

export default function Home() {
  return (
    <div className="grid h-full w-full grid-cols-2 content-start justify-center gap-5 p-5 md:px-50 md:py-20 xl:flex xl:flex-1 xl:flex-wrap">
      {opciones.map((opcion) => (
        <div
          key={opcion.id}
          className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded bg-background2 p-5 text-center transition hover:bg-background4 xl:w-1/6"
        >
          <div>{opcion.icono}</div>
          <div className="text-sm font-semibold xl:text-lg">
            {opcion.nombre}
          </div>
        </div>
      ))}
    </div>
  )
}
