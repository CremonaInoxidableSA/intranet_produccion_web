"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { secciones } from "./data"
import {
  AlertDialogTemplate,
  DialogTemplate,
  DateRangePicker,
} from "@/components/componentsClient"
import {
  TextScrollArea,
  BotonIcono,
  SelectorMultiple,
  Boton,
  Textarea,
  ItemCard,
} from "@/components/components"
import {
  useMonitoreoEnCurso,
  useMonitoreoFinalizadas,
  toOptions,
  useTareaEditor,
} from "./funciones"
import {
  useTareasUsuario,
  useDetalleTareaFinalizada,
} from "@/context/dataUserContext"
import { CronometroEdicion, DuracionInput } from "@/components/cronometro"
import { Trash2, Download } from "lucide-react"

export default function Monitoreo() {
  const [seccionActiva, setSeccionActiva] = useState<number>(1)
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

  const [tareaFinalizadaEditando, setTareaFinalizadaEditando] = useState<
    number | null
  >(null)
  const { detalle: detalleF, loading: loadingDetalleF } =
    useDetalleTareaFinalizada(tareaFinalizadaEditando)

  const curso = useMonitoreoEnCurso()
  const finalizadas = useMonitoreoFinalizadas()

  const etiquetasEnCurso = curso.tareas.map(
    (t) =>
      `TAREA ${t.id_tarea} | ${t.nombre_operario_seleccionado} ${t.apellido_operario_seleccionado}`
  )
  const subtitulosEnCurso = curso.tareas.map(
    (t) => `${t.nombre_producto} - ${t.nombre_labor}`
  )
  const etiquetasFinalizadas = finalizadas.tareas.map(
    (t) =>
      `TAREA ${t.id_tarea} | ${t.nombre_operario_seleccionado} ${t.apellido_operario_seleccionado}`
  )
  const subtitulosFinalizadas = finalizadas.tareas.map(
    (t) => `${t.nombre_producto} - ${t.nombre_labor}`
  )

  return (
    <div className="flex flex-1 h-full flex-col items-center gap-5 p-5">
      <h1 className="text-xl font-bold xl:text-2xl">MONITOREO</h1>

      {/* Botones de sección — solo visibles en mobile */}
      <div className="flex w-full flex-row items-center justify-center gap-5 xl:hidden">
        {secciones.map(({ id, nombre, extraClasses }) => {
          const isActive = seccionActiva === id
          return (
            <Button
              key={id}
              onClick={() => setSeccionActiva(id)}
              className={`flex flex-1 items-center justify-center rounded font-semibold transition-all duration-200 ${
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

      <div className="flex w-full flex-1 flex-col gap-5 xl:flex-row">
        {/* Columna EN CURSO */}
        <div
          className={`${
            seccionActiva === 1 ? "flex" : "hidden"
          } flex-col gap-5 xl:flex flex-1`}
        >
          <div className="flex flex-col gap-3 rounded bg-background2 p-5">
            <h1 className="text-md font-bold xl:text-lg">
              FILTRO TAREAS EN CURSO
            </h1>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              <SelectorMultiple
                placeholder="N° OP"
                data={toOptions(curso.filtros.numeros_op)}
                keyId="id"
                keyLabel="nombre"
                values={curso.opSel}
                onValuesChange={curso.setOpSel}
              />
              <SelectorMultiple
                placeholder="N° PLANO"
                data={toOptions(curso.filtros.numeros_plano)}
                keyId="id"
                keyLabel="nombre"
                values={curso.planoSel}
                onValuesChange={curso.setPlanoSel}
              />
              <SelectorMultiple
                placeholder="OPERARIO"
                data={toOptions(curso.filtros.operarios)}
                keyId="id"
                keyLabel="nombre"
                values={curso.operarioSel}
                onValuesChange={curso.setOperarioSel}
              />
              <SelectorMultiple
                placeholder="SECTOR"
                data={toOptions(curso.filtros.sectores)}
                keyId="id"
                keyLabel="nombre"
                values={curso.sectorSel}
                onValuesChange={curso.setSectorSel}
              />
            </div>
            <Boton
              placeholder="APLICAR FILTROS"
              onClick={curso.aplicarFiltros}
              disabled={curso.loading}
            />
          </div>

          <TextScrollArea
            tags={etiquetasEnCurso}
            subtitles={subtitulosEnCurso}
            placeholder="TAREAS EN CURSO"
            extraClass="flex flex-1 flex-col gap-3 rounded bg-background2 p-5"
            placeholderExtraClass="xl:text-lg text-md"
            onTagClick={(_, index) =>
              setTareaEditando(curso.tareas[index].id_tarea)
            }
            extras={(_, index) => (
              <BotonIcono
                icono={Trash2}
                iconClass="size-6 text-red-600"
                onClick={() => setFilaEliminando(curso.tareas[index].id_tarea)}
              />
            )}
          />
        </div>

        {/* Columna FINALIZADAS */}
        <div
          className={`${
            seccionActiva === 2 ? "flex" : "hidden"
          } flex-col gap-5 xl:flex flex-1`}
        >
          <div className="flex flex-col gap-3 rounded bg-background2 p-5">
            <h1 className="text-md font-bold xl:text-lg">
              FILTRO TAREAS FINALIZADAS
            </h1>
            <DateRangePicker
              value={finalizadas.dateRange}
              onValueChange={finalizadas.setDateRange}
            />
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              <SelectorMultiple
                placeholder="N° OP"
                data={toOptions(finalizadas.filtros.numeros_op)}
                keyId="id"
                keyLabel="nombre"
                values={finalizadas.opSel}
                onValuesChange={finalizadas.setOpSel}
              />
              <SelectorMultiple
                placeholder="N° PLANO"
                data={toOptions(finalizadas.filtros.numeros_plano)}
                keyId="id"
                keyLabel="nombre"
                values={finalizadas.planoSel}
                onValuesChange={finalizadas.setPlanoSel}
              />
              <SelectorMultiple
                placeholder="OPERARIO"
                data={toOptions(finalizadas.filtros.operarios)}
                keyId="id"
                keyLabel="nombre"
                values={finalizadas.operarioSel}
                onValuesChange={finalizadas.setOperarioSel}
              />
              <SelectorMultiple
                placeholder="SECTOR"
                data={toOptions(finalizadas.filtros.sectores)}
                keyId="id"
                keyLabel="nombre"
                values={finalizadas.sectorSel}
                onValuesChange={finalizadas.setSectorSel}
              />
            </div>
            <div className="flex gap-3">
              <Boton
                placeholder="APLICAR FILTROS"
                onClick={finalizadas.aplicarFiltros}
                disabled={finalizadas.loading}
                extraClass="flex-1"
              />
              <Button
                onClick={finalizadas.descargarExcel}
                disabled={finalizadas.tareas.length === 0}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="size-4" />
                EXCEL
              </Button>
            </div>
          </div>

          <TextScrollArea
            tags={etiquetasFinalizadas}
            subtitles={subtitulosFinalizadas}
            placeholder="TAREAS FINALIZADAS"
            extraClass="flex flex-1 flex-col gap-3 rounded bg-background2 p-5"
            placeholderExtraClass="xl:text-lg text-md"
            onTagClick={(_, index) =>
              setTareaFinalizadaEditando(finalizadas.tareas[index].id_tarea)
            }
            extras={(_, index) => (
              <BotonIcono
                icono={Trash2}
                iconClass="size-6 text-red-600"
                onClick={() =>
                  setFilaEliminando(finalizadas.tareas[index].id_tarea)
                }
              />
            )}
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

      <DialogTemplate
        title={
          tareaFinalizadaEditando ? `TAREA ${tareaFinalizadaEditando}` : ""
        }
        description="Detalles de la tarea finalizada."
        fields={
          loadingDetalleF ? (
            <p className="text-sm opacity-50">Cargando...</p>
          ) : detalleF ? (
            <div className="flex flex-col gap-3">
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="OPERARIO"
                description={`${detalleF.apellido_operario_seleccionado} ${detalleF.nombre_operario_seleccionado}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="SECTOR"
                description={`${detalleF.nombre_sector}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="N° ORDEN DE PRODUCCION"
                description={`${detalleF.numero_op}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="N° PLANO"
                description={`${detalleF.numero_plano}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="PRODUCTO"
                description={`${detalleF.nombre_producto}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="LABOR"
                description={`${detalleF.nombre_labor}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="DESCRIPCION"
                description={`${detalleF.descripcion || "—"}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="TIEMPO EXTRA"
                description={`${detalleF.tiempo_extra}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="TIEMPO CRONOMETRADO"
                description={`${detalleF.tiempo_cronometrado ?? "—"}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="TIEMPO TOTAL"
                description={`${detalleF.tiempo_total ?? "—"}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="FECHA INICIO"
                description={`${detalleF.fecha_inicio}`}
              />
              <ItemCard
                variant="outline"
                size="sm"
                className="p-3"
                title="FECHA FIN"
                description={`${detalleF.fecha_fin}`}
              />
            </div>
          ) : null
        }
        dialogFooter={
          <div className="flex w-full justify-end">
            <Button
              onClick={() => {
                if (detalleF && tareaFinalizadaEditando) {
                  const link = document.createElement("a")
                  link.href = `/api/tareas/tarea-finalizada-excel?id_tarea=${tareaFinalizadaEditando}`
                  link.download = `tarea_${tareaFinalizadaEditando}.xlsx`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }
              }}
              className="flex items-center gap-2"
            >
              <Download className="size-4" />
              DESCARGAR EXCEL
            </Button>
          </div>
        }
        open={tareaFinalizadaEditando !== null}
        onOpenChange={(open) => {
          if (!open) setTareaFinalizadaEditando(null)
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
    </div>
  )
}
