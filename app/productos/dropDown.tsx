"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis, PencilLine, Copy, Trash2 } from "lucide-react"
import type { Labor, Producto } from "@/types/types"
import { useAutorizacion } from "@/context/useAutorizacion"

export function MenuAccionesProducto({
  producto,
  onEditar,
  onEliminar,
  onDuplicar,
}: {
  producto: Producto
  onEditar: (producto: Producto) => void
  onEliminar: (productoId: number) => void
  onDuplicar: (id_producto: number) => void
}) {
  const { autorizacion } = useAutorizacion()

  const puedeEditarProducto = autorizacion.productos.editar
  const puedeDuplicarProducto = autorizacion.productos.duplicar
  const puedeEliminarProducto = autorizacion.productos.eliminar

  const puedeGestionarProducto =
    puedeEditarProducto || puedeDuplicarProducto || puedeEliminarProducto

  if (!puedeGestionarProducto) {
    return null
  }

  if (producto.nombre === "Otro") {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>

        {puedeEditarProducto && (
          <DropdownMenuItem asChild>
            <button
              onClick={() => onEditar(producto)}
              className="flex w-full cursor-pointer flex-row items-center justify-start gap-2 text-orangecremona"
            >
              <PencilLine className="h-4 w-4" />
              <span>Editar</span>
            </button>
          </DropdownMenuItem>
        )}

        {puedeDuplicarProducto && (
          <DropdownMenuItem asChild>
            <button
              onClick={() => onDuplicar(producto.id_producto)}
              className="flex w-full cursor-pointer flex-row items-center justify-start gap-2 text-bluecremona"
            >
              <Copy className="h-4 w-4" />
              <span>Duplicar</span>
            </button>
          </DropdownMenuItem>
        )}

        {puedeEliminarProducto && (
          <DropdownMenuItem asChild>
            <button
              onClick={() => onEliminar(producto.id_producto)}
              className="flex w-full cursor-pointer flex-row items-center justify-start gap-2 text-redcremona"
            >
              <Trash2 className="h-4 w-4" />
              <span>Eliminar</span>
            </button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MenuAccionesLabor({
  labor,
  onEditar,
  onEliminar,
}: {
  labor: Labor
  onEditar: (labor: Labor) => void
  onEliminar: (laborId: number) => void
}) {
  const { autorizacion } = useAutorizacion()

  const puedeEditarLabor = autorizacion.productos.editar
  const puedeEliminarLabor = autorizacion.productos.eliminar

  const puedeGestionarLabor = puedeEditarLabor || puedeEliminarLabor

  if (!puedeGestionarLabor) {
    return null
  }

  if (labor.nombre === "Otro") {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>

        {puedeEditarLabor && (
          <DropdownMenuItem asChild>
            <button
              onClick={() => onEditar(labor)}
              className="flex w-full cursor-pointer flex-row items-center justify-start gap-2 text-orangecremona"
            >
              <PencilLine className="h-4 w-4" />
              <span>Editar</span>
            </button>
          </DropdownMenuItem>
        )}

        {puedeEliminarLabor && (
          <DropdownMenuItem asChild>
            <button
              onClick={() => onEliminar(labor.id_labor)}
              className="flex w-full cursor-pointer flex-row items-center justify-start gap-2 text-redcremona"
            >
              <Trash2 className="h-4 w-4" />
              <span>Eliminar</span>
            </button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
