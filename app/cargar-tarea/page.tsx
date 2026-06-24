"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { secciones, getOpcionesNuevaTarea } from "./data"
import {
  AlertDialogTemplate,
  DialogTemplate,
} from "@/components/componentsClient"
import { TextScrollArea } from "@/components/components"
import { Textarea } from "@/components/components" // Ahora acepta value/onChange
import { Cronometro, DuracionInput } from "@/components/cronometro"
import {
  useSectores,
  useProductos,
  useLabores,
  useOperarios,
} from "@/context/dataGeneralContext"
import { useTareasUsuario, useDetalleTarea } from "@/context/dataUserContext"
import { toast } from "sonner"

export default function CargarTarea() {
  const [seccionActiva, setSeccionActiva] = useState<number>(1)
  const [tareaEditando, setTareaEditando] = useState<number | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<number | null>(null)
  const [sectorSeleccionado, setSectorSeleccionadoState] = useState<
    number | null
  >(null)
  const [productoSeleccionado, setProductoSeleccionadoState] = useState<
    number | null
  >(null)
  const [operarioSeleccionado, setOperarioSeleccionado] = useState<
    number | null
  >(null)
  const [laborSeleccionada, setLaborSeleccionada] = useState<number | null>(
    null
  )
  const [laborManual, setLaborManual] = useState("")

  // Estados para edición en el diálogo
  const [descripcionEdit, setDescripcionEdit] = useState("")
  const [tiempoExtraEdit, setTiempoExtraEdit] = useState("")
  const [dirty, setDirty] = useState(false)
  const [cronometroKey, setCronometroKey] = useState(0)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

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
        mostrarInputLabor
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

  // Sincronizar los estados editables con el detalle cargado
  useEffect(() => {
    if (detalle) {
      setDescripcionEdit(detalle.descripcion || "")
      setTiempoExtraEdit(detalle.tiempo_extra || "00:00:00")
      setDirty(false)
    }
  }, [detalle])

  // Detectar cambios para habilitar el botón Guardar
  useEffect(() => {
    if (detalle) {
      const descChanged = descripcionEdit !== (detalle.descripcion || "")
      const tiempoChanged =
        tiempoExtraEdit !== (detalle.tiempo_extra || "00:00:00")
      setDirty(descChanged || tiempoChanged)
    }
  }, [descripcionEdit, tiempoExtraEdit, detalle])

  // Eliminar tarea
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
      toast.success("Tarea eliminada")
    } catch {
      toast.error("No se pudo eliminar la tarea")
    }
  }

  const handleGuardar = async () => {
    const id = tareaEditando
    if (!id || !detalle) return

    const descChanged = descripcionEdit !== (detalle.descripcion || "")
    const tiempoChanged =
      tiempoExtraEdit !== (detalle.tiempo_extra || "00:00:00")

    if (!descChanged && !tiempoChanged) {
      toast.info("No hay cambios para guardar")
      return
    }

    const promises = []

    if (descChanged) {
      promises.push(
        fetch("/api/actualizar-descripcion", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_tarea: id, descripcion: descripcionEdit }),
        }).then((res) => res.json())
      )
    }

    if (tiempoChanged) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
      if (!timeRegex.test(tiempoExtraEdit)) {
        toast.error("Formato de tiempo extra inválido. Debe ser HH:MM:SS")
        return
      }
      promises.push(
        fetch("/api/actualizar-tiempo-extra", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_tarea: id, tiempo_extra: tiempoExtraEdit }),
        }).then((res) => res.json())
      )
    }

    try {
      const results = await Promise.all(promises)
      const hasError = results.some((r) => r.success === false || r.error)
      if (hasError) {
        results.forEach((r) => {
          if (r.success === false || r.error) {
            toast.error(r.error || r.detail || "Error al guardar")
          }
        })
      } else {
        toast.success("Cambios guardados correctamente")
        setDirty(false)
        refetch()
        setTareaEditando(null)
      }
    } catch {
      toast.error("Error al conectar con el servidor")
    }
  }

  // Reiniciar cronómetro
  const handleReiniciarCronometro = async () => {
    const id = tareaEditando
    if (!id) return

    try {
      const res = await fetch("/api/reiniciar-tiempo-cronometrado", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_tarea: id }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Cronómetro reiniciado")
        setCronometroKey((prev) => prev + 1) // forzar reinicio visual del Cronometro
      } else {
        toast.error(data.error || "Error al reiniciar cronómetro")
      }
    } catch {
      toast.error("Error al conectar con el servidor")
    }
  }

  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="flex w-full justify-center text-xl font-bold md:text-2xl">
        CARGAR NUEVA TAREA
      </h1>

      <div className="my-5 flex w-full flex-row items-center justify-center gap-5 xl:hidden">
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

      <div className="flex flex-col xl:flex-row gap-5">
        <div
          className={`w-full xl:flex xl:w-1/2 xl:flex-col ${seccionActiva === 1 ? "flex flex-col gap-5" : "hidden"}`}
        >
          <h2 className="hidden w-full justify-center text-lg font-semibold xl:flex">
            {secciones.find((s) => s.id === 1)?.nombre}
          </h2>
          <div className="flex min-h-0 flex-1 flex-col gap-5 xl:justify-between">
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
            extraClass="bg-background2 p-5 h-[70vh] xl:flex-1 xl:min-h-0"
            placeholderExtraClass="text-md"
            onTagClick={(tag) => {
              const id = Number(tag.split(" ")[1].replace(":", ""))
              setTareaEditando(id)
            }}
          />
        </div>
      </div>

      {/* Diálogo de edición */}
      <DialogTemplate
        title={tareaEditando ? `TAREA ${tareaEditando}` : ""}
        description="Editar los detalles de la tarea seleccionada."
        fields={
          loadingDetalle ? (
            <p className="text-sm opacity-50">Cargando...</p>
          ) : detalle ? (
            <div className="flex flex-col gap-5">
              {/* Operario */}
              <div className="flex flex-col gap-2 rounded bg-background2 p-5">
                <h1 className="text-md flex w-full items-center font-bold">
                  OPERARIO
                </h1>
                <div className="flex flex-col gap-5">
                  <div className="w-full rounded bg-background p-2">
                    <p>
                      {detalle.nombre_operario_seleccionado}{" "}
                      {detalle.apellido_operario_seleccionado}
                    </p>
                  </div>
                  <div className="w-full rounded bg-background p-2">
                    <p>{detalle.nombre_sector}</p>
                  </div>
                </div>
              </div>

              {/* Orden de Producción */}
              <div className="flex flex-col gap-2 rounded bg-background2 p-5">
                <h1 className="text-md flex w-full items-center font-bold">
                  ORDEN DE PRODUCCION
                </h1>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-3">
                    <div className="flex-1 rounded bg-background p-2">
                      <p className="text-xs font-semibold">N° OP</p>
                      <p>{detalle.numero_op}</p>
                    </div>
                    <div className="flex-1 rounded bg-background p-2">
                      <p className="text-xs font-semibold">N° PLANO</p>
                      <p>{detalle.numero_plano}</p>
                    </div>
                  </div>
                  <div className="rounded bg-background p-2">
                    <p className="text-xs font-semibold">PRODUCTO</p>
                    <p>{detalle.nombre_producto}</p>
                  </div>
                  <div className="rounded bg-background p-2">
                    <p className="text-xs font-semibold">LABOR</p>
                    <p>{detalle.nombre_labor}</p>
                  </div>
                  <div className="rounded bg-background p-2">
                    <p className="text-xs font-semibold">DESCRIPCIÓN</p>
                    <Textarea
                      placeholder="DETALLES DE LA TAREA, OBSERVACIONES..."
                      value={descripcionEdit}
                      onChange={(e) => setDescripcionEdit(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Tiempo Extra */}
              <div className="flex flex-col gap-2 rounded bg-background2 p-5">
                <h1 className="text-md flex w-full items-center font-bold">
                  TIEMPO EXTRA
                </h1>
                <p className="text-sm opacity-60">
                  Agregado al tiempo cronometrado
                </p>
                <DuracionInput
                  value={tiempoExtraEdit}
                  onChange={setTiempoExtraEdit}
                />
              </div>

              {/* Cronómetro */}
              <div className="flex flex-col gap-2 rounded bg-background2 p-5">
                <h1 className="text-md flex w-full items-center font-bold">
                  CRONOMETRO
                </h1>
                <Cronometro key={cronometroKey} />
                <Button
                  onClick={handleReiniciarCronometro}
                  variant="outline"
                  className="mt-2"
                >
                  Reiniciar Cronómetro
                </Button>
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
              <Button
                className="border-redcremona bg-redcremona/50 text-white hover:bg-redcremona"
                onClick={handleGuardar}
                disabled={!dirty}
              >
                GUARDAR
              </Button>
            </div>
          </div>
        }
        open={tareaEditando !== null}
        onOpenChange={(open) => {
          if (!open && dirty) {
            setShowCloseConfirm(true)
            return
          }
          if (!open) {
            setTareaEditando(null)
          }
        }}
      />

      {/* Alerta de confirmación al cerrar con cambios */}
      <AlertDialogTemplate
        open={showCloseConfirm}
        onOpenChange={(open) => {
          if (!open) setShowCloseConfirm(false)
        }}
        title="Tienes cambios sin guardar"
        description="¿Deseas descartar los cambios y salir?"
        onConfirm={() => {
          setShowCloseConfirm(false)
          setTareaEditando(null)
          setDirty(false)
        }}
        cancelText="Seguir editando"
        confirmText="Cancelar Edición"
      />

      {/* Alerta de confirmación para eliminar */}
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