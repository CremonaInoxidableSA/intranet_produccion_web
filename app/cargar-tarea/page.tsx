"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { secciones, getOpcionesNuevaTarea } from "./data"
import {
  AlertDialogTemplate,
  DialogTemplate,
} from "@/components/componentsClient"
import { TextScrollArea } from "@/components/components"
import { Textarea } from "@/components/components"
import { Cronometro, DuracionInput } from "@/components/cronometro"
import {
  useSectores,
  useProductos,
  useLabores,
  useOperarios,
} from "@/context/dataGeneralContext"
import { useTareasUsuario } from "@/context/dataUserContext"
import { useTareaEditor } from "./funciones"
import { ItemCard } from "@/components/components"
import { TimerReset } from "lucide-react"

export default function CargarTarea() {
  const [seccionActiva, setSeccionActiva] = useState<number>(1)
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

  const {
    tareaEditando,
    setTareaEditando,
    filaEliminando,
    setFilaEliminando,
    descripcionEdit,
    setDescripcionEdit,
    tiempoExtraEdit,
    setTiempoExtraEdit,
    dirty,
    cronometroKey,
    showCloseConfirm,
    setShowCloseConfirm,
    loadingDetalle,
    detalle,
    handleEliminar,
    handleGuardar,
    handleReiniciarCronometro,
    resetEditor,
    tiempoCronometrado,
  } = useTareaEditor()

  const { tareas } = useTareasUsuario()
  const { operarios } = useOperarios()
  const { sectores } = useSectores()
  const { productos } = useProductos(sectorSeleccionado)
  const { labores } = useLabores(sectorSeleccionado, productoSeleccionado)

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

      <div className="flex flex-col gap-5 xl:flex-row">
        <div
          className={`w-full xl:flex xl:w-1/2 xl:flex-col ${
            seccionActiva === 1 ? "flex flex-col gap-5" : "hidden"
          }`}
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
          className={`md:flex md:w-1/2 md:flex-col md:gap-5 ${
            seccionActiva === 2 ? "flex flex-col gap-5" : "hidden"
          }`}
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
            <div className="flex flex-col gap-3">
              {/* Operario */}
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="OPERARIO"
                description={`${detalle.nombre_operario_seleccionado} ${detalle.apellido_operario_seleccionado}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="SECTOR"
                description={`${detalle.nombre_sector}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="NUMERO DE ORDEN DE PRODUCCION"
                description={`${detalle.numero_op}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="NUMERO DE PLANO"
                description={`${detalle.numero_plano}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="PRODUCTO"
                description={`${detalle.nombre_producto}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="LABOR"
                description={`${detalle.nombre_labor}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="DESCRIPCION"
                description={
                  <Textarea
                    placeholder="DETALLES DE LA TAREA, OBSERVACIONES..."
                    value={descripcionEdit}
                    onChange={(e) => setDescripcionEdit(e.target.value)}
                  />
                }
              />
              {/* Tiempo Extra */}
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="TIEMPO EXTRA"
                description="Agregado al tiempo cronometrado"
              >
                <DuracionInput
                  value={tiempoExtraEdit}
                  onChange={setTiempoExtraEdit}
                />
              </ItemCard>
              
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="CRONOMETRO"
                actions={
                  <Button
                    onClick={handleReiniciarCronometro}
                    variant="outline"
                    size="sm"
                  >
                    <TimerReset />
                  </Button>
                }
              >
                <Cronometro value={tiempoCronometrado} readOnly={true} />
              </ItemCard>
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
            resetEditor()
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
          resetEditor()
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
