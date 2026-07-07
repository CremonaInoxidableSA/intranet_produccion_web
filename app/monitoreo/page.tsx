"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { secciones, opcionesTarea } from "./data"
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
} from "@/components/components"
import {
  useMonitoreoEnCurso,
  useMonitoreoFinalizadas,
  toOptions,
} from "./funciones"
import { Trash2 } from "lucide-react"

export default function Monitoreo() {
  const [tareaEditando, setTareaEditando] = useState<number | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<number | null>(null)
  const [seccionActiva, setSeccionActiva] = useState<number>(1)

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
    <div className="flex flex-1 flex-col items-center gap-5 p-5">
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
          } flex-col gap-5 xl:flex xl:flex-1`}
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
                iconClass="size-6"
                onClick={() => setFilaEliminando(curso.tareas[index].id_tarea)}
              />
            )}
          />
        </div>

        {/* Columna FINALIZADAS */}
        <div
          className={`${
            seccionActiva === 2 ? "flex" : "hidden"
          } flex-col gap-5 xl:flex xl:flex-1`}
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
            <Boton
              placeholder="APLICAR FILTROS"
              onClick={finalizadas.aplicarFiltros}
              disabled={finalizadas.loading}
            />
          </div>

          <TextScrollArea
            tags={etiquetasFinalizadas}
            subtitles={subtitulosFinalizadas}
            placeholder="TAREAS FINALIZADAS"
            extraClass="flex flex-1 flex-col gap-3 rounded bg-background2 p-5"
            placeholderExtraClass="xl:text-lg text-md"
            onTagClick={(_, index) =>
              setTareaEditando(finalizadas.tareas[index].id_tarea)
            }
            extras={(_, index) => (
              <BotonIcono
                icono={Trash2}
                iconClass="size-6"
                onClick={() =>
                  setFilaEliminando(finalizadas.tareas[index].id_tarea)
                }
              />
            )}
          />
        </div>
      </div>

      <DialogTemplate
        title={""}
        description="Editar los detalles de la tarea seleccionada."
        fields={opcionesTarea.map((opcion) => (
          <div className="w-full rounded bg-background2 p-4" key={opcion.id}>
            {opcion.contenido}
          </div>
        ))}
        dialogFooter={
          <div className="flex w-full flex-row items-center justify-between">
            <Button
              className="border-red-600 bg-red-600/50 text-white hover:bg-red-600"
              onClick={() => {}}
            >
              ELIMINAR
            </Button>
            <Button className="border-redcremona bg-redcremona/50 text-white hover:bg-redcremona">
              GUARDAR
            </Button>
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
          if (!open) setFilaEliminando(null)
        }}
        title="¿Eliminar tarea?"
        description={`Esta acción no se puede deshacer. Se eliminará la tarea ${filaEliminando ?? ""}.`}
        onConfirm={() => setFilaEliminando(null)}
      />
    </div>
  )
}
