import { useState, useMemo, useCallback } from "react"
import { useUser } from "@/context/userContext"
import { roles } from "./data"
import { handleApiResponse } from "@/lib/response-handler"

export function useUsuarioForm() {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [legajo, setLegajo] = useState("")
  const [rolId, setRolId] = useState("")

  const { id_current_user } = useUser()

  const formularioCompleto = useMemo(
    () =>
      nombre.trim() !== "" &&
      apellido.trim() !== "" &&
      legajo.trim() !== "" &&
      rolId !== "",
    [nombre, apellido, legajo, rolId]
  )

  const resetFormulario = useCallback(() => {
    setNombre("")
    setApellido("")
    setLegajo("")
    setRolId("")
  }, [])

  const handleCargarUsuario = useCallback(async () => {
    if (!formularioCompleto) return
    const rolSeleccionado = roles.find((r) => r.id_rol === rolId)
    if (!rolSeleccionado) return

    try {
      const res = await fetch("/api/crear/crear-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_user_id: id_current_user,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          legajo: Number(legajo),
          rol: rolSeleccionado.rol,
        }),
      })
      await handleApiResponse(res)
      resetFormulario()
    } catch {}
  }, [
    formularioCompleto,
    id_current_user,
    nombre,
    apellido,
    legajo,
    rolId,
    resetFormulario,
  ])

  return {
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
  }
}
