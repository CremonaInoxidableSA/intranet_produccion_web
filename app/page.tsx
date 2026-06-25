import {
  Users,
  Timer,
  PackageSearch,
  DatabaseBackup,
  CircuitBoard,
} from "lucide-react"

import Link from "next/link"

const estilosIconos = "h-12 w-12"

const opciones = [
  {
    id: 1,
    nombre: "NUEVA TAREA",
    icono: <Timer className={estilosIconos} />,
    enlace: "/cargar-tarea",
  },
  {
    id: 2,
    nombre: "OPERARIOS",
    icono: <Users className={estilosIconos} />,
    enlace: "/operarios",
  },
  {
    id: 3,
    nombre: "PRODUCTOS",
    icono: <PackageSearch className={estilosIconos} />,
    enlace: "/productos",
  },
  {
    id: 4,
    nombre: "MONITOREO",
    icono: <CircuitBoard className={estilosIconos} />,
    enlace: "/monitoreo",
  },
  {
    id: 5,
    nombre: "BACKUP",
    icono: <DatabaseBackup className={estilosIconos} />,
    enlace: "/backup",
  },
]

export default function Home() {
  return (
    <div className="grid h-full w-full grid-cols-2 content-start justify-center gap-5 p-5 md:px-50 md:py-20 xl:flex xl:flex-1 xl:flex-wrap">
      {opciones.map((opcion) => (
        <Link
          key={opcion.id}
          href={opcion.enlace}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded bg-background2 p-5 text-center transition hover:bg-background4 xl:w-1/6"
        >
          <div>{opcion.icono}</div>
          <div className="text-sm font-semibold xl:text-xl">
            {opcion.nombre}
          </div>
        </Link>
      ))}
    </div>
  )
}
