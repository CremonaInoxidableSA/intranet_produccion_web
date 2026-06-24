"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { secciones, getOpcionesNuevaTarea } from "./data"
import { AlertDialogTemplate, DialogTemplate } from "@/components/componentsClient"
import { TextScrollArea } from "@/components/components"
import { useSectores, useProductos, useLabores, useOperarios } from "@/context/dataGeneralContext"
import { useTareasUsuario, useDetalleTarea } from "@/context/dataUserContext"

export default function CargarTarea() {
  const [seccionActiva, setSeccionActiva] = useState<number>(1)
  const [tareaEditando, setTareaEditando] = useState<number | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<number | null>(null)
  const [sectorSeleccionado, setSectorSeleccionadoState] = useState<number | null>(null)
  const [productoSeleccionado, setProductoSeleccionadoState] = useState<number | null>(null)
  const [operarioSeleccionado, setOperarioSeleccionado] = useState<number | null>(null)
  const [laborSeleccionada, setLaborSeleccionada] = useState<number | null>(null)

  const [laborManual, setLaborManual] = useState("")

  const setSectorSeleccionado = useCallback((id: number | null) => {
    setSectorSeleccionadoState(id)
    setProductoSeleccionadoState(null)
    setLaborSeleccionada(null)
    setLaborManual("")
  }, [])

  const setProductoSeleccionado = useCallback((id: number | null) => {
    setProductoSeleccionadoState(id)
    setLaborSeleccionada(null)
    setLaborManual("")
  }, [])
  
  const { tareas, refetch } = useTareasUsuario()
  const { detalle, loading: loadingDetalle } = useDetalleTarea(tareaEditando)
  const { operarios } = useOperarios()
  const { sectores } = useSectores()
  const { productos } = useProductos(sectorSeleccionado)
  const { labores } = useLabores(sectorSeleccionado, productoSeleccionado)
  
  const productoActual = useMemo(
    () => productos.find((p) => p.id_producto === productoSeleccionado),
    [productos, productoSeleccionado]
  )

  const esOtros = useMemo(
    () => productoActual?.nombre.trim().toLowerCase() === "otros",
    [productoActual]
  )

  const mostrarInputLabor = useMemo(
    () => esOtros || labores.length === 0,
    [esOtros, labores.length]
  )

  const opciones = useMemo(
    () =>
      getOpcionesNuevaTarea(
        productos,
        sectores,
        labores,
        operarios,
        sectorSeleccionado,
        setSectorSeleccionado,
        productoSeleccionado,
        setProductoSeleccionado,
        operarioSeleccionado,
        setOperarioSeleccionado,
        laborSeleccionada,
        setLaborSeleccionada,
        laborManual,
        setLaborManual,
        mostrarInputLabor,

      ),
    [
      productos,
      sectores,
      labores,
      sectorSeleccionado,
      productoSeleccionado,
      operarioSeleccionado,
      laborSeleccionada,
      laborManual,
      mostrarInputLabor,
    ]
  )

  const handleEliminar = async () => {
    const id = filaEliminando
    if (id === null) return

    try {
      const response = await fetch(`/api/eliminar-tarea?id_tarea=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error()

      setFilaEliminando(null)
      setTareaEditando(null)
      refetch()
    } catch {
      console.error("No se pudo eliminar la tarea")
    }
  }
  
  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="flex w-full justify-center text-xl font-bold md:text-2xl">
        CARGAR NUEVA TAREA
      </h1>

      <div className="my-5 flex w-full flex-row items-center justify-center gap-5 md:hidden">
        {secciones.map(({ id, nombre, extraClasses }) => {
          const isActive = seccionActiva === id
          return (
            <Button
              key={id}
              onClick={() => setSeccionActiva(id)}
              className={`flex flex-1 items-center justify-center rounded font-semibold text-white transition-all duration-200 ${
                isActive
                  ? `${extraClasses} ring-1 ring-offset-1 ring-offset-foreground`
                  : `${extraClasses} opacity-50`
              }`}
            >
              {nombre}
            </Button>
          )
        })}
      </div>

      <div className="flex flex-col md:flex-row md:gap-20">
        <div
          className={`w-full md:flex md:w-1/2 md:flex-col md:gap-5 ${seccionActiva === 1 ? "flex flex-col gap-5" : "hidden"}`}
        >
          <h2 className="hidden w-full justify-center text-lg font-semibold md:flex">
            {secciones.find((s) => s.id === 1)?.nombre}
          </h2>
          <div className="flex min-h-0 flex-1 flex-col gap-5 md:justify-between">
            {opciones.map((opcion) => (
              <div
                className="w-full rounded bg-background2 p-5"
                key={opcion.id}
              >
                {opcion.contenido}
              </div>
            ))}
          </div>
        </div>

        <div
          className={`md:flex md:w-1/2 md:flex-col md:gap-5 ${seccionActiva === 2 ? "flex flex-col gap-5" : "hidden"}`}
        >
          <h2 className="hidden justify-center text-lg font-semibold md:flex">
            {secciones.find((s) => s.id === 2)?.nombre}
          </h2>
          <TextScrollArea
            tags={tareas.map(
              (tarea) =>
                `TAREA ${tarea.id_tarea}: ${tarea.nombre_operario_seleccionado} ${tarea.apellido_operario_seleccionado} - ${tarea.nombre_producto}`
            )}
            placeholder="LISTADO DE TAREAS EN CURSO"
            extraClass="bg-background2 p-5 h-[70vh] md:flex-1 md:min-h-0"
            placeholderExtraClass="text-md"
            onTagClick={(tag) => {
              const id = Number(tag.split(" ")[1].replace(":", ""))
              setTareaEditando(id)
            }}
          />
        </div>
      </div>

      <DialogTemplate
        title={tareaEditando ? `TAREA ${tareaEditando}` : ""}
        description="Editar los detalles de la tarea seleccionada."
        fields={
          loadingDetalle ? (
            <p className="text-sm opacity-50">Cargando...</p>
          ) : detalle ? (
            <div className="flex flex-col gap-3">
              <div className="rounded bg-background2 p-3">
                <p className="text-xs font-semibold">OPERARIO</p>
                <p>
                  {detalle.nombre_operario_seleccionado}{" "}
                  {detalle.apellido_operario_seleccionado}
                </p>
              </div>
              <div className="w-full rounded bg-background2 p-4">
                <p className="text-xs font-semibold">SECTOR</p>
                <p>{detalle.nombre_sector}</p>
              </div>
              <div className="flex w-full gap-3 rounded bg-background2 p-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold">N° OP</p>
                  <p>{detalle.numero_op}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">N° PLANO</p>
                  <p>{detalle.numero_plano}</p>
                </div>
              </div>
              <div className="w-full rounded bg-background2 p-4">
                <p className="text-xs font-semibold">PRODUCTO</p>
                <p>{detalle.nombre_producto}</p>
              </div>
              <div className="w-full rounded bg-background2 p-4">
                <p className="text-xs font-semibold">LABOR</p>
                <p>{detalle.nombre_labor}</p>
              </div>
              <div className="w-full rounded bg-background2 p-4">
                <p className="text-xs font-semibold">DESCRIPCIÓN</p>
                <p>{detalle.descripcion || "—"}</p>
              </div>
              <div className="w-full rounded bg-background2 p-4">
                <p className="text-xs font-semibold">TIEMPO EXTRA</p>
                <p>{detalle.tiempo_extra}</p>
              </div>
            </div>
          ) : null
        }
        dialogFooter={
          <div className="flex w-full flex-row items-center justify-between">
            <Button
              className="border-red-600 bg-red-600/50 text-white hover:bg-red-600"
              onClick={() => {
                setFilaEliminando(tareaEditando)
              }}
            >
              ELIMINAR
            </Button>
            <div className="flex w-full flex-row items-center justify-end gap-5">
              <Button className="border-bluecremona bg-bluecremona/50 text-white hover:bg-bluecremona">
                FINALIZAR
              </Button>
              <Button className="border-redcremona bg-redcremona/50 text-white hover:bg-redcremona">
                GUARDAR
              </Button>
            </div>
          </div>
        }
        open={tareaEditando !== null}
        onOpenChange={(open) => {
          if (!open) setTareaEditando(null)
        }}
      />

      <AlertDialogTemplate
        open={filaEliminando !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFilaEliminando(null)
          }
        }}
        title="¿Eliminar tarea?"
        description={`Esta acción no se puede deshacer. Se eliminará la tarea ${filaEliminando ?? ""}.`}
        onConfirm={handleEliminar}
      />
    </div>
  )
}
