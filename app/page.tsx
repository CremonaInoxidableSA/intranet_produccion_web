"use client"

import { useMemo, type ComponentType } from "react"
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

const toAbsoluteUrl = (path: string) => {
  const rawPath = path.trim()

  if (!rawPath) {
    return "#"
  }

  if (rawPath.startsWith("/")) {
    return rawPath.replace(/\/{2,}/g, "/")
  }

  if (/^https?:\/\//i.test(rawPath)) {
    const [protocolo, ...resto] = rawPath.split("://")
    const rutaNormalizada = resto.join("://").replace(/\/{2,}/g, "/")
    return `${protocolo}://${rutaNormalizada}`
  }

  if (rawPath.includes(".")) {
    return `https://${rawPath}`.replace(/([^:]\/)\/+?/g, "$1")
  }

  return `/${rawPath.replace(/^\/+/, "").replace(/\/{2,}/g, "/")}`
}

const toTitle = (value: string) =>
  value
    .replace(/^SUBMODULO_/, "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

export default function Home() {
  const { user } = useAuth()
  const { tieneAccesoSubmodulo } = useAutorizacion()

  const submodulosDisponibles = useMemo(
    () =>
      Object.entries(user?.submodulos_personales ?? {})
        .filter(([nombre]) => tieneAccesoSubmodulo(nombre))
        .map(([nombre, submodulo]) => {
          const Icon = resolveIcon(submodulo.icono)

          return {
            nombre,
            titulo: toTitle(nombre),
            enlace: toAbsoluteUrl(submodulo.path),
            Icon,
          }
        }),
    [tieneAccesoSubmodulo, user?.submodulos_personales]
  )

  return (
    <div className="grid h-full w-full grid-cols-2 content-start justify-center gap-5 p-5 md:px-50 md:py-20 xl:flex xl:flex-1 xl:flex-wrap">
      {submodulosDisponibles.map((submodulo) => {
        const Icon = submodulo.Icon
        const esEnlaceExterno = /^https?:\/\//i.test(submodulo.enlace)

        return (
          <a
            key={submodulo.nombre}
            href={submodulo.enlace}
            target={esEnlaceExterno ? "_blank" : undefined}
            rel={esEnlaceExterno ? "noopener noreferrer" : undefined}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded bg-background2 p-5 text-center transition hover:bg-background4 xl:w-1/6"
          >
            <Icon className="h-12 w-12" />
            <div className="text-sm font-semibold xl:text-xl">
              {submodulo.titulo}
            </div>
          </a>
        )
      })}
    </div>
  )
}
