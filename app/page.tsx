"use client"

import { useMemo, type ComponentType, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CircleHelp,
  type LucideProps,
  icons as lucideIcons,
} from "lucide-react"
import { useAuth } from "@/context/AuthProvider"
import { useAutorizacion } from "@/context/useAutorizacion"

const fallbackIcon: ComponentType<LucideProps> = CircleHelp

const resolveIcon = (iconName: string) => {
  const lucideIcon = lucideIcons[iconName as keyof typeof lucideIcons]
  return lucideIcon ?? fallbackIcon
}

const toTitle = (value: string) =>
  value
    .replace(/^SUBMODULO_/, "")
    .replace(/_/g, " ")
    .toUpperCase()

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const { tieneAccesoSubmodulo } = useAutorizacion()
  const [, setOpen] = useState(true)

  const submodulosDisponibles = useMemo(
    () =>
      Object.entries(user?.submodulos_personales ?? {})
        .filter(([nombre]) => tieneAccesoSubmodulo(nombre))
        .map(([nombre, submodulo]) => {
          const Icon = resolveIcon(submodulo.icono)

          return {
            nombre,
            titulo: toTitle(nombre),
            path: submodulo.path,
            Icon,
          }
        }),
    [tieneAccesoSubmodulo, user?.submodulos_personales]
  )

  const handleNavigation = (path: string) => {
    router.push(path)
    setOpen(false)
  }

  return (
    <div className="grid h-full w-full grid-cols-2 content-start justify-center gap-5 p-5 md:px-50 md:py-20 xl:flex xl:flex-1 xl:flex-wrap">
      {submodulosDisponibles.map((submodulo) => {
        const Icon = submodulo.Icon

        return (
          <button
            key={submodulo.nombre}
            onClick={() => handleNavigation(submodulo.path)}
            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded bg-background2 p-5 text-center transition hover:bg-background4 xl:w-1/6"
          >
            <Icon className="aspect-square size-20" />
            <div className="text-sm font-semibold xl:text-xl">
              {submodulo.titulo}
            </div>
          </button>
        )
      })}
    </div>
  )
}
