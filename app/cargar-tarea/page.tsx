"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { secciones, getOpcionesNuevaTarea } from "./data"
import {
  AlertDialogTemplate,
  DialogTemplate,
} from "@/components/componentsClient"
import {
  Textarea,
  TextScrollArea,
  Boton,
  ItemCard,
} from "@/components/components"
import { CronometroEdicion, DuracionInput } from "@/components/cronometro"
import {
  useSectores,
  useProductosSector,
  useLabores,
  useOperarios,
} from "@/context/dataGeneralContext"
import { useTareasUsuario } from "@/context/dataUserContext"
import { useUser } from "@/context/userContext"
import { useTareaEditor } from "./funciones"
import { handleApiResponse } from "@/lib/response-handler"

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
  const [numeroOp, setNumeroOp] = useState<number | null>(null)
  const [numeroPlano, setNumeroPlano] = useState<string | null>(null)
  const [descripcion, setDescripcion] = useState("")
  const [tiempoExtra, setTiempoExtra] = useState("00:00:00")

  const { tareas, refetch, removeTareaLocal } = useTareasUsuario()

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
    showCloseConfirm,
    setShowCloseConfirm,
    loadingDetalle,
    detalle,
    handleEliminar,
    handleGuardar,
    handleReiniciarCronometro,
    resetEditor,
    tiempoCronometrado,
    showReiniciarConfirm,
    setShowReiniciarConfirm,
    handlePausarTarea,
    handleFinalizar,
  } = useTareaEditor({ refetch, removeTareaLocal })

  const { id_current_user, nombre_usuario_logeado, apellido_usuario_logeado } =
    useUser()
  const { operarios } = useOperarios()
  const { sectores } = useSectores()
  const { productos } = useProductosSector(sectorSeleccionado)
  const { labores } = useLabores(sectorSeleccionado, productoSeleccionado)

  const [operarioOcupadoInfo, setOperarioOcupadoInfo] = useState<{
    detail: string
    nombre_labor: string
    nombre_creador: string
    apellido_creador: string
    id_tarea: number
    id_operario: number
  } | null>(null)

  const handleSeleccionarOperario = useCallback(async (id: number | null) => {
    if (id === null) {
      setOperarioSeleccionado(null)
      return
    }
    try {
      const res = await fetch(
        `/api/comprobacion-operarioOcupado?id_operario=${id}`
      )
      const data = await res.json()
      if (data.success === false) {
        setOperarioOcupadoInfo({ ...data, id_operario: id })
      } else {
        setOperarioSeleccionado(id)
      }
    } catch {
      setOperarioSeleccionado(id)
    }
  }, [])

  const handlePausarTareaPrevia = useCallback(async () => {
    if (!operarioOcupadoInfo) return
    try {
      const res = await fetch(
        `/api/actualizar/actualizar-pausarCronometro?id_tarea=${operarioOcupadoInfo.id_tarea}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      )
      await handleApiResponse(res)
      setOperarioSeleccionado(operarioOcupadoInfo.id_operario)
      setOperarioOcupadoInfo(null)
      await refetch()
    } catch {}
  }, [operarioOcupadoInfo, refetch])

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

  const handleCambioSector = useCallback((id: number | null) => {
    setSectorSeleccionadoState(id)
    setProductoSeleccionadoState(null)
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

  const mostrarInputLabor = useMemo(() => esOtros, [esOtros])

  const laborBloqueada = useMemo(
    () => productoSeleccionado !== null && !esOtros && labores.length === 0,
    [productoSeleccionado, esOtros, labores.length]
  )

  const laborNombre = useMemo(() => {
    if (mostrarInputLabor) return laborManual.trim()
    const labor = labores.find((l) => l.id_labor === laborSeleccionada)
    return labor?.nombre ?? ""
  }, [mostrarInputLabor, laborManual, labores, laborSeleccionada])

  const formularioCompleto = useMemo(
    () =>
      operarioSeleccionado !== null &&
      sectorSeleccionado !== null &&
      productoSeleccionado !== null &&
      numeroOp !== null &&
      numeroPlano !== "" &&
      (mostrarInputLabor
        ? laborManual.trim() !== ""
        : laborSeleccionada !== null),
    [
      operarioSeleccionado,
      sectorSeleccionado,
      productoSeleccionado,
      numeroOp,
      numeroPlano,
      mostrarInputLabor,
      laborManual,
      laborSeleccionada,
    ]
  )

  type CrearTareaResponse = {
    id_tarea?: number
  }

  const resetFormulario = useCallback(() => {
    setSectorSeleccionadoState(null)
    setProductoSeleccionadoState(null)
    setOperarioSeleccionado(null)
    setLaborSeleccionada(null)
    setLaborManual("")
    setNumeroOp(null)
    setNumeroPlano("")
    setDescripcion("")
    setTiempoExtra("00:00:00")
  }, [])

  const handleCrearTarea = useCallback(async () => {
    if (!formularioCompleto || !id_current_user) return

    const operarioActual = operarios.find(
      (o) => o.id_operario === operarioSeleccionado
    )

    const body = {
      id_usuario_logeado: id_current_user,
      nombre_usuario_logeado,
      apellido_usuario_logeado,
      id_operario_seleccionado: operarioSeleccionado,
      nombre_operario_seleccionado: operarioActual?.nombre ?? "",
      apellido_operario_seleccionado: operarioActual?.apellido ?? "",
      id_sector: sectorSeleccionado,
      numero_op: numeroOp,
      numero_plano: numeroPlano,
      id_producto: productoSeleccionado,
      nombre_labor: laborNombre,
      descripcion: descripcion.trim(),
      tiempo_extra: tiempoExtra,
    }

    try {
      const res = await fetch("/api/crear/crear-tarea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      await handleApiResponse<CrearTareaResponse>(res, (data) =>
        data?.id_tarea
          ? `Tarea ${data.id_tarea} creada correctamente`
          : "Tarea creada correctamente"
      )

      resetFormulario()
      await refetch()
    } catch {}
  }, [
    formularioCompleto,
    id_current_user,
    nombre_usuario_logeado,
    apellido_usuario_logeado,
    operarios,
    operarioSeleccionado,
    sectorSeleccionado,
    numeroOp,
    numeroPlano,
    productoSeleccionado,
    laborNombre,
    descripcion,
    tiempoExtra,
    resetFormulario,
    refetch,
  ])

  const opciones = useMemo(
    () =>
      getOpcionesNuevaTarea(
        productos,
        sectores,
        labores,
        operarios,
        sectorSeleccionado,
        handleCambioSector,
        productoSeleccionado,
        setProductoSeleccionado,
        operarioSeleccionado,
        handleSeleccionarOperario,
        laborSeleccionada,
        setLaborSeleccionada,
        laborManual,
        setLaborManual,
        mostrarInputLabor,
        laborBloqueada,
        numeroOp,
        setNumeroOp,
        numeroPlano,
        setNumeroPlano,
        descripcion,
        setDescripcion,
        tiempoExtra,
        setTiempoExtra,
        formularioCompleto,
        handleCrearTarea
      ),
    [
      productos,
      sectores,
      labores,
      operarios,
      sectorSeleccionado,
      productoSeleccionado,
      operarioSeleccionado,
      handleSeleccionarOperario,
      laborSeleccionada,
      laborManual,
      mostrarInputLabor,
      numeroOp,
      numeroPlano,
      descripcion,
      tiempoExtra,
      formularioCompleto,
      handleCrearTarea,
    ]
  )

  return (
    <div className="flex flex-1 flex-col p-5">
      <h1 className="flex w-full justify-center text-xl font-bold xl:text-2xl">
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
          className={`w-full xl:flex xl:w-1/2 xl:flex-col xl:gap-5 ${
            seccionActiva === 1 ? "flex flex-col gap-5" : "hidden"
          }`}
        >
          <h2 className="hidden w-full justify-center text-lg font-semibold xl:flex">
            {secciones.find((s) => s.id === 1)?.nombre}
          </h2>
          <form className="flex min-h-0 flex-1 flex-col gap-5 xl:justify-between">
            {opciones.map((opcion) => (
              <div
                className="w-full rounded bg-background2 p-5"
                key={opcion.id}
              >
                {opcion.contenido}
              </div>
            ))}
          </form>
        </div>

        <div
          className={`xl:flex xl:w-1/2 xl:flex-col xl:gap-5 ${
            seccionActiva === 2 ? "flex flex-col gap-5" : "hidden"
          }`}
        >
          <h2 className="hidden justify-center text-lg font-semibold xl:flex">
            {secciones.find((s) => s.id === 2)?.nombre}
          </h2>
          <TextScrollArea
            tags={tareas.map(
              (tarea) =>
                `TAREA ${tarea.id_tarea}: ${tarea.apellido_operario_seleccionado} ${tarea.nombre_operario_seleccionado} - ${tarea.nombre_producto}`
            )}
            placeholder="LISTADO DE TAREAS EN CURSO"
            extraClass="bg-background2 p-5 h-[70vh] xl:flex-1 xl:min-h-0"
            placeholderExtraClass="text-md"
            extras={(tag) => {
              const id = Number(tag.split(" ")[1].replace(":", ""))
              const estado = tareas.find((t) => t.id_tarea === id)?.estado ?? ""
              const isPausada = estado.toLowerCase() === "pausada"
              return (
                <span
                  className={`rounded px-2 py-0.5 text-xs font-semibold ${
                    isPausada
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-greencremona/20 text-greencremona"
                  }`}
                >
                  {estado.toUpperCase()}
                </span>
              )
            }}
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
            <p className="h-500 text-sm opacity-50">Cargando...</p>
          ) : detalle ? (
            <div className="flex flex-col gap-3">
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="OPERARIO"
                description={`${detalle.apellido_operario_seleccionado} ${detalle.nombre_operario_seleccionado}`}
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
              >
                <CronometroEdicion
                  value={tiempoCronometrado}
                  estado={detalle?.estado}
                  onTogglePausa={handlePausarTarea}
                  onReiniciar={() => setShowReiniciarConfirm(true)}
                />
              </ItemCard>
            </div>
          ) : null
        }
        dialogFooter={
          <div className="flex w-full flex-row items-center justify-between">
            <Boton
              extraClass="border-red-600 bg-red-600/50 hover:bg-red-600"
              onClick={() => setFilaEliminando(tareaEditando)}
              placeholder="ELIMINAR"
            />
            <div className="flex w-full flex-row items-center justify-end gap-5">
              <Boton
                extraClass="border-greencremona bg-greencremona/40 hover:bg-greencremona/80"
                placeholder="GUARDAR"
                onClick={handleGuardar}
                disabled={!dirty}
              />
              <Boton
                extraClass="border-bluecremona bg-bluecremona/40 hover:bg-bluecremona/80"
                placeholder="FINALIZAR"
                onClick={handleFinalizar}
                disabled={dirty}
              />
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

      <AlertDialogTemplate
        open={filaEliminando !== null}
        onOpenChange={(open) => {
          if (!open) setFilaEliminando(null)
        }}
        title="¿Eliminar tarea?"
        description={`Esta acción no se puede deshacer. Se eliminará la tarea ${filaEliminando ?? ""}.`}
        onConfirm={handleEliminar}
      />

      <AlertDialogTemplate
        open={showReiniciarConfirm}
        onOpenChange={setShowReiniciarConfirm}
        title="¿Reiniciar cronómetro?"
        description="Esta acción reiniciará el tiempo cronometrado a cero. Esta operación no se puede deshacer. ¿Estás seguro de continuar?"
        onConfirm={handleReiniciarCronometro}
        cancelText="Cancelar"
        confirmText="Reiniciar"
      />

      <AlertDialogTemplate
        open={operarioOcupadoInfo !== null}
        onOpenChange={(open) => {
          if (!open) setOperarioOcupadoInfo(null)
        }}
        title={operarioOcupadoInfo?.detail ?? ""}
        description={
          operarioOcupadoInfo ? (
            <span className="flex flex-col gap-1 text-sm">
              <span className="block">
                <span className="font-semibold">Operario:</span>{" "}
                {operarios.find(
                  (o) => o.id_operario === operarioOcupadoInfo.id_operario
                )?.nombre_completo ?? `ID ${operarioOcupadoInfo.id_operario}`}
              </span>
              <span className="block">
                <span className="font-semibold">Labor:</span>{" "}
                {operarioOcupadoInfo.nombre_labor}
              </span>
              <span className="block">
                <span className="font-semibold">Creado por:</span>{" "}
                {operarioOcupadoInfo.nombre_creador}{" "}
                {operarioOcupadoInfo.apellido_creador}
              </span>
              <span className="block">
                <span className="font-semibold">ID Tarea:</span>{" "}
                {operarioOcupadoInfo.id_tarea}
              </span>
            </span>
          ) : (
            ""
          )
        }
        onConfirm={handlePausarTareaPrevia}
        cancelText="Seleccionar otro operario"
        confirmText="Pausar tarea previa"
      />
    </div>
  )
}
