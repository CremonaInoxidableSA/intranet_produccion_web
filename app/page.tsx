import { Users, BookOpenText, Timer } from "lucide-react"

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
]

export default function Home() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-5 p-5">
      {opciones.map((opcion) => (
        <Link
          key={opcion.id}
          href={opcion.enlace}
          className="bg-background2 hover:bg-background4 flex aspect-square w-1/4 cursor-pointer flex-col items-center justify-center gap-5 rounded-md p-6 text-center transition"
        >
          <div className="text-9xl">{opcion.icono}</div>
          <div className="text-xl font-semibold">{opcion.nombre}</div>
        </Link>
      ))}
    </div>
  )
}
