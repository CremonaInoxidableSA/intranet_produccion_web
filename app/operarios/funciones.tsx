import { useState, useMemo, useCallback } from "react"
import { useUser } from "@/context/userContext"
import { useOperarios } from "@/context/dataGeneralContext"
import { Operario } from "@/types/types"
import { handleApiResponse } from "@/lib/response-handler"
import { fetchWithConnectionCheck } from "@/lib/connectionManager"
import { roles } from "./data"

export function useUsuarioForm() {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [legajo, setLegajo] = useState("")
  const [rolId, setRolId] = useState("")
  const [email, setEmail] = useState("")
  const [dni, setDni] = useState("")
  const [loading, setLoading] = useState(false)

  const { id_current_user } = useUser()
  const {
    operarios,
    loading: loadingUsuarios,
    refetch: refetchUsuarios,
  } = useOperarios()

  const usuarios = useMemo(
    () =>
      [...operarios].sort((a, b) =>
        `${a.apellido} ${a.nombre}`.localeCompare(
          `${b.apellido} ${b.nombre}`,
          "es"
        )
      ),
    [operarios]
  )

  const formularioCompleto = useMemo(
    () =>
      nombre.trim() !== "" &&
      apellido.trim() !== "" &&
      legajo.trim() !== "" &&
      rolId !== "" &&
      dni.trim() !== "" &&
      email.trim() !== "",
    [nombre, apellido, legajo, rolId, dni, email]
  )

  const resetFormulario = useCallback(() => {
    setNombre("")
    setApellido("")
    setLegajo("")
    setRolId("")
    setDni("")
    setEmail("")
  }, [])

  const handleCargarUsuario = useCallback(async () => {
    if (!formularioCompleto) return
    const rolSeleccionado = roles.find((r) => r.id_rol === rolId)
    if (!rolSeleccionado) return

    setLoading(true)
    try {
      const res = await fetchWithConnectionCheck("/api/crear/crear-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_user_id: id_current_user,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          legajo: Number(legajo),
          rol: rolSeleccionado.rol,
          email: email.trim(),
          dni: Number(dni),
        }),
      })
      await handleApiResponse(res)
      resetFormulario()
      await refetchUsuarios()
    } catch {
    } finally {
      setLoading(false)
    }
  }, [
    formularioCompleto,
    id_current_user,
    nombre,
    apellido,
    legajo,
    rolId,
    resetFormulario,
    refetchUsuarios,
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
    loading,
    usuarios,
    loadingUsuarios,
    refetchUsuarios,
    email,
    setEmail,
    dni,
    setDni,
  }
}

export function useUsuarioEditor({
  refetchUsuarios,
}: {
  refetchUsuarios: () => Promise<void>
}) {
  const { id_current_user } = useUser()

  const [usuarioEditando, setUsuarioEditando] = useState<Operario | null>(null)
  const [nombreEdit, setNombreEdit] = useState("")
  const [apellidoEdit, setApellidoEdit] = useState("")
  const [rolIdEdit, setRolIdEdit] = useState("")
  const [emailEdit, setEmailEdit] = useState("")
  const [dniEdit, setDniEdit] = useState("")
  const [loadingEdit, setLoadingEdit] = useState(false)

  const abrirEdicion = useCallback((usuario: Operario) => {
    setUsuarioEditando(usuario)
    setNombreEdit(usuario.nombre?.toString() ?? "")
    setApellidoEdit(usuario.apellido?.toString() ?? "")
    const rolActual = roles.find((r) => r.rol === usuario.grupo)
    setRolIdEdit(rolActual?.id_rol ?? "")
    setEmailEdit(usuario.email ?? "")
    setDniEdit(usuario.dni?.toString() ?? "")
  }, [])

  const cerrarEdicion = useCallback(() => {
    setUsuarioEditando(null)
    setNombreEdit("")
    setApellidoEdit("")
    setRolIdEdit("")
    setEmailEdit("")
    setDniEdit("")
  }, [])

  const formularioEditCompleto = useMemo(
    () =>
      nombreEdit.trim() !== "" &&
      apellidoEdit.trim() !== "" &&
      rolIdEdit !== "",
    [nombreEdit, apellidoEdit, rolIdEdit]
  )

  const handleGuardarEdicion = useCallback(async () => {
    if (!usuarioEditando || !formularioEditCompleto) return

    const rolNuevo = roles.find((r) => r.id_rol === rolIdEdit)
    if (!rolNuevo) return

    setLoadingEdit(true)
    try {
      const res = await fetchWithConnectionCheck(
        "/api/actualizar/actualizar-usuarioProduccion",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            current_user_id: id_current_user,
            id_operario: usuarioEditando.id_operario,
            nombre: nombreEdit.trim(),
            apellido: apellidoEdit.trim(),
            viejo_grupo: usuarioEditando.grupo,
            grupo: rolNuevo.rol,
          }),
        }
      )
      await handleApiResponse(res)
      cerrarEdicion()
      await refetchUsuarios()
    } catch {
    } finally {
      setLoadingEdit(false)
    }
  }, [
    usuarioEditando,
    formularioEditCompleto,
    rolIdEdit,
    id_current_user,
    nombreEdit,
    apellidoEdit,
    cerrarEdicion,
    refetchUsuarios,
  ])

  return {
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
    emailEdit,
    setEmailEdit,
    dniEdit,
    setDniEdit,
  }
}
