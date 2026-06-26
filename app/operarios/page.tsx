"use client"

import { useState } from "react"
import {
  TablaEdicion,
  DialogTemplate,
  AlertDialogTemplate,
} from "@/components/componentsClient"
import { Selector, Inputs, Boton } from "@/components/components"
import { Button } from "@/components/ui/button"
import { useSectores } from "@/context/dataGeneralContext"
import { roles, datosUsuarios } from "./data"
import { useUsuarioForm } from "./funciones"

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
  } = useUsuarioForm()

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
              />
              <Inputs
                placeholder="APELLIDO"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
              <Inputs
                placeholder="LEGAJO"
                type="number"
                value={legajo}
                onChange={(e) => setLegajo(e.target.value)}
              />
              <Selector
                placeholder="ROL"
                data={roles}
                keyId="id_rol"
                keyLabel="nombre_rol"
                value={rolId}
                onValueChange={setRolId}
              />
              <Button
                className="w-full bg-bluecremona hover:bg-bluecremona/80"
                disabled={!formularioCompleto}
                onClick={handleCargarUsuario}
              >
                CARGAR USUARIO
              </Button>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex w-full flex-col gap-2 rounded bg-background2 p-5 md:w-2/3 xl:w-1/3">
          <h1 className="flex w-full items-center text-xl font-bold">
            REGISTROS
          </h1>
          <TablaEdicion
            columns={["NOMBRE_APELLIDO", "LEGAJO"]}
            data={datosUsuarios}
            onClickEdit={(row) => setFilaEditando(row)}
          />
        </div>
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
