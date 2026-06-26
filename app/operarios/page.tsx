"use client"

import { useMemo } from "react"
import { DialogTemplate } from "@/components/componentsClient"
import {
  Selector,
  Inputs,
  Boton,
  TextScrollArea,
  ItemCard,
} from "@/components/components"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { roles } from "./data"
import { useUsuarioForm, useUsuarioEditor } from "./funciones"

export default function Usuarios() {
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
    refetchUsuarios,
  } = useUsuarioForm()

  const {
    usuarioEditando,
    abrirEdicion,
    cerrarEdicion,
    nombreEdit,
    setNombreEdit,
    apellidoEdit,
    setApellidoEdit,
    rolIdEdit,
    setRolIdEdit,
    formularioEditCompleto,
    handleGuardarEdicion,
    loadingEdit,
  } = useUsuarioEditor({ refetchUsuarios })

  const tagOperarioMap = useMemo(
    () =>
      new Map(
        usuarios.map((u) => [`${u.apellido} ${u.nombre} - ${u.legajo}`, u])
      ),
    [usuarios]
  )

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
        {/* Panel izquierdo - Cargar usuario */}
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

        {/* Panel derecho - Listado */}
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
          onTagClick={(tag) => {
            const operario = tagOperarioMap.get(tag)
            if (!operario) return
            abrirEdicion({
              id_operario: operario.id_operario,
              nombre: operario.nombre,
              apellido: operario.apellido,
              rol_nombre: operario.rol_nombre,
            })
          }}
          placeholder="LISTADO DE USUARIOS"
          extraClass="bg-background2 p-5 h-[70vh] w-full xl:flex-1 xl:min-h-0"
          placeholderExtraClass="text-md font-bold"
        />
      </div>

      {/* Dialog edición */}
      <DialogTemplate
        open={usuarioEditando !== null}
        onOpenChange={(open) => {
          if (!open) cerrarEdicion()
        }}
        title={`Editar: ${usuarioEditando ? `${usuarioEditando.apellido} ${usuarioEditando.nombre}` : ""}`}
        description="Modificá los datos del operario."
        fields={
          <div className="flex flex-col gap-3">
            <ItemCard
              variant="outline"
              size="sm"
              className="p-3"
              title="NOMBRE DEL USUARIO"
              description={
                <Inputs
                  placeholder="NOMBRE"
                  type="text"
                  value={nombreEdit}
                  onChange={(e) => setNombreEdit(e.target.value)}
                  disabled={loadingEdit}
                />
              }
            />

            <ItemCard
              variant="outline"
              size="sm"
              className="p-3"
              title="APELLIDO DEL USUARIO"
              description={
                <Inputs
                  placeholder="APELLIDO"
                  type="text"
                  value={apellidoEdit}
                  onChange={(e) => setApellidoEdit(e.target.value)}
                  disabled={loadingEdit}
                />
              }
            />

            <ItemCard
              variant="outline"
              size="sm"
              className="p-3"
              title="ROL DEL USUARIO"
              description={
                <Selector
                  placeholder="ROL"
                  data={roles}
                  keyId="id_rol"
                  keyLabel="nombre_rol"
                  value={rolIdEdit}
                  onValueChange={setRolIdEdit}
                  disabled={loadingEdit}
                />
              }
            />
          </div>
        }
        dialogFooter={
          <Boton
            placeholder={loadingEdit ? "GUARDANDO..." : "GUARDAR"}
            extraClass="border-bluecremona bg-bluecremona/50 text-white hover:bg-bluecremona"
            disabled={!formularioEditCompleto || loadingEdit}
            onClick={handleGuardarEdicion}
          />
        }
      />
    </div>
  )
}
