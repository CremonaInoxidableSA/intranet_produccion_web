import { Users, BookOpenText, Timer, PackageSearch, DatabaseBackup, CircuitBoard } from "lucide-react"

import Link from "next/link"

const opciones = [
  {
    id: 1,
    nombre: "CARGAR NUEVA TAREA",
    icono: <Timer />,
    enlace: "/cargar-tarea",
  },
  {
    id: 2,
    nombre: "VER REGISTROS",
    icono: <BookOpenText />,
    enlace: "/registros",
  },
  {
    id: 3,
    nombre: "OPERARIOS",
    icono: <Users />,
    enlace: "/operarios",
  },
  {
    id: 4,
    nombre: "PRODUCTOS",
    icono: <PackageSearch />,
    enlace: "/productos",
  },
  {
    id: 5,
    nombre: "MONITOREO",
    icono: <CircuitBoard />,
    enlace: "/monitoreo",
  },
  {
    id: 6,
    nombre: "BACKUP",
    icono: <DatabaseBackup />,
    enlace: "/backup",
  },
]

export default function Home() {
  return (
    <div className="flex flex-1 flex-wrap content-start justify-center gap-5 px-50 py-20">
      {opciones.map((opcion) => (
        <Link
          key={opcion.id}
          href={opcion.enlace}
          className="flex aspect-square w-1/5 min-w-45 cursor-pointer flex-col items-center justify-center gap-5 rounded-md bg-background2 p-6 text-center transition hover:bg-background4"
        >
          <div className="text-9xl">{opcion.icono}</div>
          <div className="text-xl font-semibold">{opcion.nombre}</div>
        </Link>
      ))}
    </div>
  )
}
