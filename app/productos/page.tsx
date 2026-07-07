"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { PencilLine, Trash2 } from "lucide-react"
import {
  DialogTemplate,
  AlertDialogTemplate,
} from "@/components/componentsClient"
import {
  TextScrollArea,
  Inputs,
  Selector,
  SelectorMultiple,
  Boton,
  BotonIcono,
} from "@/components/components"
import {
  useSectores,
  useProductos,
  useLaborresProducto,
} from "@/context/dataGeneralContext"
import type { Producto } from "@/context/dataGeneralContext"
import { handleApiResponse } from "@/lib/response-handler"

export default function Productos() {
  const { sectores } = useSectores()
  const { productos, refetch: refetchProductos } = useProductos()

  // --- Producto seleccionado (para labores) ---
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null)

  useEffect(() => {
    if (productos.length > 0 && productoSeleccionado === null) {
      setProductoSeleccionado(productos[0])
    }
  }, [productos, productoSeleccionado])

  const selectedIndex = productoSeleccionado
    ? productos.findIndex(
        (p) => p.id_producto === productoSeleccionado.id_producto
      )
    : -1

  // --- Labores del producto seleccionado ---
  const { labores, refetch: refetchLabores } = useLaborresProducto(
    productoSeleccionado?.id_producto ?? null
  )

  const laboresNombres = labores.map((l) => l.nombre)
  const laboresSectores = labores.map((l) => l.sector)

  // --- Eliminar producto ---
  const [productoEliminar, setProductoEliminar] = useState<number | null>(null)

  const handleEliminarProducto = async () => {
    if (productoEliminar === null) return
    try {
      const res = await fetch("/api/eliminar/eliminar-producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto: productoEliminar }),
      })
      await handleApiResponse(res)
      setProductoEliminar(null)
      if (productoSeleccionado?.id_producto === productoEliminar) {
        setProductoSeleccionado(null)
      }
      await refetchProductos()
    } catch {}
  }

  // --- Eliminar labor ---
  const [laborEliminar, setLaborEliminar] = useState<number | null>(null)

  const handleEliminarLabor = async () => {
    if (laborEliminar === null) return
    try {
      const res = await fetch("/api/eliminar/eliminar-labor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_labor: laborEliminar }),
      })
      await handleApiResponse(res)
      setLaborEliminar(null)
      await refetchLabores()
    } catch {}
  }

  // --- Crear labor ---
  const [nombreLabor, setNombreLabor] = useState("")
  const [sectorLabor, setSectorLabor] = useState("")

  const sectoresDelProducto = sectores.filter((s) =>
    productoSeleccionado?.sectores.includes(s.nombre)
  )

  const handleCrearLabor = async () => {
    if (!nombreLabor.trim() || !sectorLabor || !productoSeleccionado) {
      toast.error("Completá todos los campos")
      return
    }
    try {
      const res = await fetch("/api/crear/crear-labor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreLabor.trim(),
          id_sector: Number(sectorLabor),
          id_producto: productoSeleccionado.id_producto,
        }),
      })
      await handleApiResponse(res)
      setNombreLabor("")
      setSectorLabor("")
      await refetchLabores()
    } catch {}
  }

  // --- Crear producto ---
  const [nombreProducto, setNombreProducto] = useState("")
  const [sectoresProducto, setSectoresProducto] = useState<string[]>([])

  const handleCrearProducto = async () => {
    if (!nombreProducto.trim() || sectoresProducto.length === 0) {
      toast.error("Completá el nombre y seleccioná al menos un sector")
      return
    }
    try {
      const res = await fetch("/api/crear/crear-producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreProducto.trim(),
          id_sectores: sectoresProducto.map(Number),
        }),
      })
      await handleApiResponse(res)
      setNombreProducto("")
      setSectoresProducto([])
      await refetchProductos()
    } catch {}
  }

  // --- Editar producto (dialog) ---
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null
  )
  const [nombreEdit, setNombreEdit] = useState("")

  const abrirDialogEditar = (p: Producto) => {
    setProductoEditando(p)
    setNombreEdit(p.nombre)
  }

  const handleGuardarNombre = async () => {
    if (!productoEditando) return
    if (!nombreEdit.trim()) {
      toast.error("El nombre no puede estar vacío")
      return
    }
    try {
      const res = await fetch("/api/actualizar/actualizar-nombre-producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_producto: productoEditando.id_producto,
          nombre: nombreEdit.trim(),
        }),
      })
      await handleApiResponse(res)
      setProductoEditando(null)
      await refetchProductos()
    } catch {}
  }

  const productoNombres = productos.map((p) => p.nombre)
  const productoSubtitulos = productos.map((p) => p.sectores.join(", "))

  return (
    <div className="flex h-500 flex-col items-center justify-center gap-2 p-5 xl:flex-1">
      <h1 className="flex w-full justify-center text-xl font-bold">
        PRODUCTOS
      </h1>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-5 xl:h-[76vh] xl:w-6/7 xl:flex-row">
        {/* Columna 1 - Productos */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 rounded bg-background2 p-5 xl:w-1/3">
          <TextScrollArea
            tags={productoNombres}
            subtitles={productoSubtitulos}
            selectedIndex={selectedIndex >= 0 ? selectedIndex : undefined}
            placeholder="LISTADO DE PRODUCTOS"
            extraClass="flex-1 min-h-0 p-5 border"
            placeholderExtraClass="md:text-xl text-md"
            onTagClick={(_, index) => {
              setProductoSeleccionado(productos[index])
              setSectorLabor("")
            }}
            extras={(_, index) => (
              <div className="flex items-center gap-1">
                <BotonIcono
                  icono={PencilLine}
                  iconClass="size-5 opacity-50 hover:opacity-100"
                  onClick={() => abrirDialogEditar(productos[index])}
                />
                <BotonIcono
                  icono={Trash2}
                  iconClass="size-5 text-red-500"
                  onClick={() =>
                    setProductoEliminar(productos[index].id_producto)
                  }
                />
              </div>
            )}
          />
          <h1 className="flex w-full shrink-0 items-center text-xl font-bold">
            CARGAR NUEVO PRODUCTO
          </h1>
          <div className="flex w-full shrink-0 flex-col justify-between gap-5">
            <Inputs
              placeholder="NOMBRE"
              type="text"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
            />
            <SelectorMultiple
              placeholder="SECTORES"
              data={sectores}
              keyId="id_sector"
              values={sectoresProducto}
              onValuesChange={setSectoresProducto}
            />
            <Boton
              placeholder="CREAR NUEVO PRODUCTO"
              onClick={handleCrearProducto}
            />
          </div>
        </div>

        {/* Columna 2 - Labores */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 rounded bg-background2 p-5 xl:w-1/3">
          <TextScrollArea
            tags={laboresNombres}
            subtitles={laboresSectores}
            placeholder={`LISTADO DE LABORES${productoSeleccionado ? ` — ${productoSeleccionado.nombre}` : ""}`}
            extraClass="flex-1 min-h-0 p-5 border"
            placeholderExtraClass="md:text-xl text-md"
            extras={(_, index) => (
              <BotonIcono
                icono={Trash2}
                iconClass="size-5 text-red-500"
                onClick={() => setLaborEliminar(labores[index].id_labor)}
              />
            )}
          />
          <h1 className="flex w-full shrink-0 items-center text-xl font-bold">
            CARGAR NUEVO LABOR
          </h1>
          <div className="flex w-full shrink-0 flex-col justify-between gap-5">
            <Inputs
              placeholder="PRODUCTO"
              type="text"
              value={productoSeleccionado?.nombre ?? ""}
              disabled
            />
            <Inputs
              placeholder="NOMBRE LABOR"
              type="text"
              value={nombreLabor}
              onChange={(e) => setNombreLabor(e.target.value)}
            />
            <Selector
              placeholder="SECTOR"
              data={sectoresDelProducto}
              keyId="id_sector"
              value={sectorLabor}
              onValueChange={setSectorLabor}
              disabled={!productoSeleccionado}
            />
            <Boton
              placeholder="CREAR NUEVO LABOR"
              onClick={handleCrearLabor}
              disabled={!productoSeleccionado}
            />
          </div>
        </div>
      </div>

      {/* Dialog editar producto */}
      <DialogTemplate
        open={productoEditando !== null}
        onOpenChange={(open) => {
          if (!open) setProductoEditando(null)
        }}
        title="EDITAR PRODUCTO"
        fields={
          <div className="flex flex-col gap-4">
            <Inputs
              placeholder="NOMBRE"
              type="text"
              value={nombreEdit}
              onChange={(e) => setNombreEdit(e.target.value)}
            />
            {productoEditando && productoEditando.sectores.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold opacity-60">
                  SECTORES ASOCIADOS
                </p>
                <div className="flex flex-wrap gap-2">
                  {productoEditando.sectores.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-foreground/20 bg-background3 px-2 py-1 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
        dialogFooter={
          <Boton placeholder="GUARDAR" onClick={handleGuardarNombre} />
        }
      />

      {/* Confirm eliminar producto */}
      <AlertDialogTemplate
        open={productoEliminar !== null}
        onOpenChange={(open) => {
          if (!open) setProductoEliminar(null)
        }}
        title="¿Eliminar producto?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleEliminarProducto}
      />

      {/* Confirm eliminar labor */}
      <AlertDialogTemplate
        open={laborEliminar !== null}
        onOpenChange={(open) => {
          if (!open) setLaborEliminar(null)
        }}
        title="¿Eliminar labor?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleEliminarLabor}
      />
    </div>
  )
}
