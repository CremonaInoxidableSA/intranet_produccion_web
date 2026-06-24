import { urlConfig } from "@/lib/config"

export interface SubItem {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  className?: string
  subItems?: SubItem[]
}

export const headerNavLeft: NavItem[] = [
  {
    label: "Home",
    href: urlConfig.homeUrl,
    className: "text-base opacity-70 transition-opacity hover:opacity-100",
    subItems: [
      { label: "Nueva Tarea", href: urlConfig.cargaUrl },
      { label: "Operarios", href: urlConfig.operariosUrl },
      { label: "Productos", href: urlConfig.productosUrl },
      { label: "Monitoreo", href: urlConfig.monitoreoUrl },
      { label: "BackUp", href: urlConfig.backupUrl },
    ],
  },
]

export const headerNavRight: NavItem[] = [
  {
    label: "Intranet",
    href: urlConfig.intranetUrl,
    className: "text-base opacity-70 transition-opacity hover:opacity-100",
  },
]