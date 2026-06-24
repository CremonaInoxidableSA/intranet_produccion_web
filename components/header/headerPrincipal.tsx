"use client"

import { ThemeSwitcher } from "@/components/theme/themeSwitcher"
import Link from "next/link"
import { useState } from "react"
import { urlConfig } from "@/lib/config"
import { LogoCreminox as Logo } from "@/components/Logos"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"

import { headerNavLeft, headerNavRight, type NavItem } from "./headerConfig"

function DrawerNavItem({
  item,
  onClose,
}: {
  item: NavItem
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  const hasSubItems = item.subItems && item.subItems.length > 0

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href={item.href}
          className="text-base opacity-70 transition-opacity hover:opacity-100"
          onClick={onClose}
        >
          {item.label}
        </Link>

        {hasSubItems && (
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="cursor-pointer p-1 opacity-70 hover:opacity-100"
            aria-label={`${open ? "Colapsar" : "Expandir"} ${item.label}`}
          >
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>

      {hasSubItems && open && (
        <div className="mt-1 ml-4 flex flex-col gap-2 border-l border-current/20 pl-3">
          {item.subItems!.map((sub, idx) => (
            <Link
              key={idx}
              href={sub.href}
              className="text-sm opacity-60 transition-opacity hover:opacity-100"
              onClick={onClose}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function HeaderPrincipal() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <>
      <header className="-header sticky top-0 left-0 z-50 flex w-full items-center bg-headerbg p-5">
        {/* Desktop: iconos izquierda */}
        <div className="hidden h-full w-[30%] flex-row items-center justify-start gap-5 xl:flex">
          <X />
          <ThemeSwitcher />
          {headerNavLeft.map((item, index) => (
            <Link key={index} href={item.href} className={item.className}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile: hamburger izquierda */}
        <div className="flex items-center xl:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
            className="flex cursor-pointer items-center justify-center"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Título centrado */}
        <p className="header flex flex-1 justify-center font-bold xl:w-[40%]">
          <span className="hidden md:inline">
            Producción Cremona Inoxidable S.A.
          </span>
          <span className="md:hidden">Producción Cremona</span>
        </p>

        {/* Desktop: links + logo */}
        <div className="hidden w-[30%] justify-end items-center gap-5 xl:flex">
          {headerNavRight.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-base opacity-70 transition-opacity hover:opacity-100"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={urlConfig.externalUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="h-full"
          >
            <Logo extraClass="h-6" />
          </Link>
        </div>

        {/* Mobile: logo derecha */}
        <div className="flex items-center xl:hidden">
          <Link
            href={urlConfig.externalUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Logo extraClass="h-6" />
          </Link>
        </div>
      </header>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer lateral izquierdo */}
      <div
        className={`-header fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-headerbg transition-transform duration-300 ease-in-out xl:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Fila superior: iconos + link derecha + cerrar */}
        <div className="flex items-center justify-between border-b border-current/20 px-4 py-4">
          <div className="flex items-center gap-4">
            <X />
            <ThemeSwitcher />
          </div>
          {headerNavRight.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-base opacity-70 transition-opacity hover:opacity-100"
              onClick={closeDrawer}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={closeDrawer}
            aria-label="Cerrar menú"
            className="flex cursor-pointer items-center justify-center"
          >
            <X size={22} />
          </button>
        </div>

        {/* Links de navegación con subitems */}
        <nav className="flex flex-col gap-2 px-4 py-5">
          {headerNavLeft.map((item, index) => (
            <DrawerNavItem key={index} item={item} onClose={closeDrawer} />
          ))}
        </nav>
      </div>
    </>
  )
}
