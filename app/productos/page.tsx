"use client"

import { useState, useEffect, useRef } from "react"
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
} from "@/components/components"
import {
  useSectores,
  useProductos,
  useLaborresProducto,
} from "@/context/dataGeneralContext"
import type { Labor, Producto, Sector } from "@/types/types"
import { useSubmoduloGuard } from "@/hooks/useSubmoduloGuard"
import { AUTORIZACIONES } from "@/lib/permisos"
import { useProductosManager } from "./funciones"
import { MenuAccionesProducto, MenuAccionesLabor } from "./dropDown"

export default function Productos() {
  const accesoPermitido = useSubmoduloGuard(AUTORIZACIONES.SUBMODULO_PRODUCTOS)
  const { sectores } = useSectores()
  const { productos, refetch: refetchProductos } = useProductos()

  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null)
  const initializedRef = useRef(false)

  const {
    productoEliminar,
    setProductoEliminar,
    laborEliminar,
    setLaborEliminar,
    laborEditando,
    setLaborEditando,
    nombreLaborEdit,
    setNombreLaborEdit,
    nombreLabor,
    setNombreLabor,
    sectorLabor,
    setSectorLabor,
    nombreProducto,
    setNombreProducto,
    sectoresProducto,
    setSectoresProducto,
    productoEditando,
    setProductoEditando,
    nombreEdit,
    setNombreEdit,
    handleEliminarProducto,
    handleEliminarLabor,
    handleCrearLabor,
    handleCrearProducto,
    handleGuardarNombre,
    handleGuardarNombreLabor,
    handleDuplicarProducto,
  } = useProductosManager()

  useEffect(() => {
    if (productos.length > 0 && !initializedRef.current) {
      initializedRef.current = true
      setProductoSeleccionado(productos[0])
    }
  }, [productos])

  const selectedIndex = productoSeleccionado
    ? productos.findIndex(
        (p) => p.id_producto === productoSeleccionado.id_producto
      )
    : -1

  const { labores, refetch: refetchLabores } = useLaborresProducto(
    productoSeleccionado?.id_producto ?? null
  )

  const laboresNombres = labores.map((l) => l.nombre)
  const laboresSectores = labores.map((l) => l.sector)

  const sectoresDelProducto = sectores.filter((s: Sector) =>
    productoSeleccionado?.sectores.includes(s.nombre)
  )

  const abrirDialogEditar = (p: Producto) => {
    setProductoEditando(p)
    setNombreEdit(p.nombre)
  }

  const abrirDialogEditarLabor = (l: Labor) => {
    setLaborEditando(l)
    setNombreLaborEdit(l.nombre)
  }

  const onEliminarProducto = async () => {
    await handleEliminarProducto(
      productoEliminar!,
      () => {
        if (productoSeleccionado?.id_producto === productoEliminar) {
          setProductoSeleccionado(null)
          setSectorLabor("")
        }
      },
      refetchProductos
    )
  }

  const onEliminarLabor = async () => {
    await handleEliminarLabor(refetchLabores)
  }

  const onCrearLabor = async () => {
    await handleCrearLabor(productoSeleccionado, refetchLabores)
  }

  const onCrearProducto = async () => {
    await handleCrearProducto(refetchProductos)
  }

  const onGuardarNombre = async () => {
    await handleGuardarNombre(productoEditando, refetchProductos)
    // Actualizar el nombre en el estado local para que se refleje inmediatamente
    setProductoSeleccionado((prev) =>
      prev && prev.id_producto === productoEditando?.id_producto
        ? { ...prev, nombre: nombreEdit }
        : prev
    )
  }

  const onGuardarNombreLabor = async () => {
    await handleGuardarNombreLabor(laborEditando, refetchLabores)
  }

  const onDuplicarProducto = async (id_producto: number) => {
    await handleDuplicarProducto(id_producto, refetchProductos)
  }

  const productoNombres = productos.map((p) => p.nombre)
  const productoSubtitulos = productos.map((p) => p.sectores.join(", "))

  if (!accesoPermitido) {
    return null
  }

  return (
    <div className="flex h-500 flex-col items-center justify-center gap-2 p-5 xl:flex-1">
      <h1 className="flex w-full justify-center text-xl font-bold">
        PRODUCTOS
      </h1>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-5 xl:h-[76vh] xl:w-6/7 xl:flex-row">
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
            extras={(_, index) => {
              return (
                <MenuAccionesProducto
                  producto={productos[index]}
                  onEditar={abrirDialogEditar}
                  onEliminar={setProductoEliminar}
                  onDuplicar={onDuplicarProducto}
                />
              )
            }}
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
              onClick={onCrearProducto}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 rounded bg-background2 p-5 xl:w-1/3">
          <TextScrollArea
            tags={laboresNombres}
            subtitles={laboresSectores}
            placeholder={`LISTADO DE LABORES${productoSeleccionado ? ` — ${productoSeleccionado.nombre}` : ""}`}
            extraClass="flex-1 min-h-0 p-5 border"
            placeholderExtraClass="md:text-xl text-md"
            extras={(_, index) => (
              <MenuAccionesLabor
                labor={labores[index]}
                onEditar={abrirDialogEditarLabor}
                onEliminar={setLaborEliminar}
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
              onClick={onCrearLabor}
              disabled={!productoSeleccionado}
            />
          </div>
        </div>
      </div>

      <DialogTemplate
        open={productoEditando !== null}
        onOpenChange={(open) => {
          if (!open) setProductoEditando(null)
        }}
        title="EDITAR NOMBRE DEL PRODUCTO"
        description="Edita el nombre del producto. El nombre no puede quedar vacio"
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
                  {productoEditando.sectores.map((s: string) => (
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
        dialogFooter={<Boton placeholder="GUARDAR" onClick={onGuardarNombre} />}
      />

      <DialogTemplate
        open={laborEditando !== null}
        onOpenChange={(open) => {
          if (!open) setLaborEditando(null)
        }}
        title="EDITAR NOMBRE DEL LABOR"
        description="Edita el nombre del labor. El nombre no puede quedar vacio"
        fields={
          <div className="flex flex-col gap-4">
            <Inputs
              placeholder="NOMBRE"
              type="text"
              value={nombreLaborEdit}
              onChange={(e) => setNombreLaborEdit(e.target.value)}
            />
            {laborEditando && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold opacity-60">SECTOR</p>
                <span className="rounded border border-foreground/20 bg-background3 px-2 py-1 text-xs">
                  {laborEditando.sector}
                </span>
              </div>
            )}
          </div>
        }
        dialogFooter={
          <Boton placeholder="GUARDAR" onClick={onGuardarNombreLabor} />
        }
      />

      <AlertDialogTemplate
        open={productoEliminar !== null}
        onOpenChange={(open) => {
          if (!open) setProductoEliminar(null)
        }}
        title="¿Eliminar producto?"
        description="Esta acción no se puede deshacer."
        onConfirm={onEliminarProducto}
      />

      <AlertDialogTemplate
        open={laborEliminar !== null}
        onOpenChange={(open) => {
          if (!open) setLaborEliminar(null)
        }}
        title="¿Eliminar labor?"
        description="Esta acción no se puede deshacer."
        onConfirm={onEliminarLabor}
      />
    </div>
  )
}
