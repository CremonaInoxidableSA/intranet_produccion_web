"use client"

import { useState, useMemo } from "react"
import {
  TablaEdicion,
  DialogTemplate,
  AlertDialogTemplate,
} from "@/components/componentsClient"
import {
  Selector,
  Inputs,
  Boton,
  TextScrollArea,
} from "@/components/components"
import { Button } from "@/components/ui/button"
import { useSectores } from "@/context/dataGeneralContext"
import { roles } from "./data"
import { useUsuarioForm } from "./funciones"
import { Spinner } from "@/components/ui/spinner"

export default function Usuarios() {
  const [filaEditando, setFilaEditando] = useState<Record<
    string,
    string
  > | null>(null)
  const [filaEliminando, setFilaEliminando] = useState<Record<
    string,
    string
  > | null>(null)

  const { sectores } = useSectores()
  const {
    nombre,
    setNombre,
    apellido,
    setApellido,
    legajo,
    setLegajo,
    rolId,
    setRolId,
    formularioCompleto,
    handleCargarUsuario,
    loading,
    usuarios,
    loadingUsuarios,
  } = useUsuarioForm()

  const tagRolMap = useMemo(
    () =>
      new Map(
        usuarios.map((u) => [
          `${u.apellido} ${u.nombre} - ${u.legajo}`,
          u.rol_display,
        ])
      ),
    [usuarios]
  )

  return (
    <div className="flex h-full w-full flex-col gap-5 p-5">
      <h1 className="flex w-full justify-center text-xl font-bold">
        LISTADO DE USUARIOS
      </h1>
      <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row md:items-start">
        {/* Panel izquierdo */}
        <div className="w-full rounded bg-background2 p-5 md:w-1/4">
          <div className="flex flex-col gap-2 bg-background2">
            <h1 className="flex w-full items-center text-xl font-bold">
              CARGAR NUEVO USUARIO
            </h1>
            <div className="flex flex-col gap-5">
              <Inputs
                placeholder="NOMBRE"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
              />
              <Inputs
                placeholder="APELLIDO"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                disabled={loading}
              />
              <Inputs
                placeholder="LEGAJO"
                type="number"
                value={legajo}
                onChange={(e) => setLegajo(e.target.value)}
                disabled={loading}
              />
              <Selector
                placeholder="ROL"
                data={roles}
                keyId="id_rol"
                keyLabel="nombre_rol"
                value={rolId}
                onValueChange={setRolId}
                disabled={loading}
              />
              <Button
                className="w-full bg-bluecremona hover:bg-bluecremona/80"
                disabled={!formularioCompleto || loading}
                onClick={handleCargarUsuario}
              >
                {loading ? <Spinner /> : "CARGAR USUARIO"}
              </Button>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <TextScrollArea
          tags={
            loadingUsuarios
              ? ["Cargando..."]
              : usuarios.map((u) => `${u.apellido} ${u.nombre} - ${u.legajo}`)
          }
          extras={(tag) => {
            const rol_display = tagRolMap.get(tag) ?? ""
            return (
              <span
                className={`rounded px-2 py-0.5 text-xs font-semibold ${
                  rol_display === "ENCARGADO"
                    ? "bg-redcremona/20 text-redcremona"
                    : "bg-greencremona/20 text-greencremona"
                }`}
              >
                {rol_display}
              </span>
            )
          }}
          placeholder={"LISTADO DE USUARIOS"}
          extraClass="bg-background2 p-5 h-[70vh] w-full xl:flex-1 xl:min-h-0"
          placeholderExtraClass="text-md font-bold"
        />
      </div>

      {/* Dialog edición */}
      <DialogTemplate
        open={filaEditando !== null}
        onOpenChange={(open) => {
          if (!open) setFilaEditando(null)
        }}
        title={`Editar: ${filaEditando?.NOMBRE_APELLIDO ?? ""}`}
        description="Modificá los datos del operario."
        fields={
          <>
            <Inputs placeholder="NOMBRE Y APELLIDO" type="text" />
            <Inputs placeholder="LEGAJO" type="text" />
            <Selector placeholder="SECTOR" data={sectores} keyId="id_sector" />
            <Selector
              placeholder="ROL"
              data={roles}
              keyId="id_rol"
              keyLabel="nombre_rol"
            />
          </>
        }
        dialogFooter={
          <div className="flex w-full flex-row items-center justify-between gap-5">
            <Boton
              placeholder="ELIMINAR"
              extraClass="border-red-600 bg-red-600/50 text-white hover:bg-red-600"
              onClick={() => {
                setFilaEditando(null)
                setFilaEliminando(filaEditando)
              }}
            />
            <Boton
              placeholder="GUARDAR"
              extraClass="border-redcremona bg-redcremona/50 text-white hover:bg-redcremona"
            />
          </div>
        }
      />

      {/* Dialog confirmación eliminación */}
      <AlertDialogTemplate
        open={filaEliminando !== null}
        onOpenChange={(open) => {
          if (!open) setFilaEliminando(null)
        }}
        title="¿Eliminar operario?"
        description={`Esta acción no se puede deshacer. Se eliminará a ${filaEliminando?.NOMBRE_APELLIDO ?? ""}.`}
        onConfirm={() => {
          setFilaEliminando(null)
        }}
      />
    </div>
  )
}
