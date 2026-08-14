import { useState, useMemo, useCallback } from "react"
import { toast } from "sonner"
import { useOperarios } from "@/context/dataGeneralContext"
import { Operario } from "@/types/types"
import { getErrorMessage, handleApiResponse } from "@/lib/response-handler"
import { fetchWithConnectionCheck } from "@/lib/connectionManager"
import {
  CrearUsuarioResponse,
  getGrupoById,
  grupos,
  isCreateUserCodeExisteGeneral,
  isCreateUserCodeExisteProduccion,
  UsuarioPendienteGrupo,
} from "./data"

export function useUsuarioForm() {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [legajo, setLegajo] = useState("")
  const [grupoId, setGrupoId] = useState("")
  const [email, setEmail] = useState("")
  const [dni, setDni] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingAsignarGrupo, setLoadingAsignarGrupo] = useState(false)
  const [usuarioPendienteGrupo, setUsuarioPendienteGrupo] =
    useState<UsuarioPendienteGrupo | null>(null)
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
      grupoId !== "" &&
      dni.trim() !== "" &&
      email.trim() !== "",
    [nombre, apellido, legajo, grupoId, dni, email]
  )

  const resetFormulario = useCallback(() => {
    setNombre("")
    setApellido("")
    setLegajo("")
    setGrupoId("")
    setDni("")
    setEmail("")
  }, [])

  const cerrarDialogoAsignarGrupo = useCallback(() => {
    setUsuarioPendienteGrupo(null)
  }, [])

  const handleCargarUsuario = useCallback(async () => {
    if (!formularioCompleto) return
    const grupoSeleccionado = getGrupoById(grupoId)
    if (!grupoSeleccionado) return

    setLoading(true)
    try {
      const res = await fetchWithConnectionCheck("/api/auth/crear-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          legajo: Number(legajo),
          grupo: grupoSeleccionado.grupo,
          email: email.trim(),
          dni: Number(dni),
        }),
      })

      let data: CrearUsuarioResponse | null = null
      try {
        data = (await res.clone().json()) as CrearUsuarioResponse
      } catch {
        data = null
      }

      if (isCreateUserCodeExisteGeneral(data?.code) && typeof data?.id === "string") {
        setUsuarioPendienteGrupo({
          id: data.id,
          grupo: grupoSeleccionado.grupo,
          detail:
            data.detail ??
            "El usuario ya existe en la intranet general y puede recibir el grupo seleccionado.",
        })
        return
      }

      if (isCreateUserCodeExisteProduccion(data?.code)) {
        toast.error(
          data?.detail ??
            "El usuario ya existe y ya tiene asignado un grupo de produccion."
        )
        return
      }

      if (res.ok) {
        await handleApiResponse(res)
        resetFormulario()
        await refetchUsuarios()
        return
      }

      toast.error(getErrorMessage(data))
    } catch {
    } finally {
      setLoading(false)
    }
  }, [
    formularioCompleto,
    nombre,
    apellido,
    legajo,
    grupoId,
    resetFormulario,
    refetchUsuarios,
    email,
    dni,
  ])

  const handleAsignarGrupoExistente = useCallback(async () => {
    if (!usuarioPendienteGrupo) return

    setLoadingAsignarGrupo(true)
    try {
      const res = await fetchWithConnectionCheck(
        "/api/auth/asignar-grupo-produccion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: usuarioPendienteGrupo.id,
            grupo: usuarioPendienteGrupo.grupo,
          }),
        }
      )

      await handleApiResponse(res)
      cerrarDialogoAsignarGrupo()
      resetFormulario()
      await refetchUsuarios()
    } finally {
      setLoadingAsignarGrupo(false)
    }
  }, [
    usuarioPendienteGrupo,
    cerrarDialogoAsignarGrupo,
    resetFormulario,
    refetchUsuarios,
  ])

  const mensajeAsignarGrupo = useMemo(() => {
    if (!usuarioPendienteGrupo) return ""

    return `${usuarioPendienteGrupo.detail} ¿Desea agregar el grupo ${usuarioPendienteGrupo.grupo} al usuario?`
  }, [usuarioPendienteGrupo])

  return {
    nombre,
    setNombre,
    apellido,
    setApellido,
    legajo,
    setLegajo,
    grupoId,
    setGrupoId,
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
    usuarioPendienteGrupo,
    mensajeAsignarGrupo,
    cerrarDialogoAsignarGrupo,
    handleAsignarGrupoExistente,
    loadingAsignarGrupo,
  }
}

export function useUsuarioEditor({
  refetchUsuarios,
}: {
  refetchUsuarios: () => Promise<void>
}) {
  const [usuarioEditando, setUsuarioEditando] = useState<Operario | null>(null)
  const [nombreEdit, setNombreEdit] = useState("")
  const [apellidoEdit, setApellidoEdit] = useState("")
  const [grupoIdEdit, setGrupoIdEdit] = useState("")
  const [emailEdit, setEmailEdit] = useState("")
  const [dniEdit, setDniEdit] = useState("")
  const [loadingEdit, setLoadingEdit] = useState(false)

  const abrirEdicion = useCallback((usuario: Operario) => {
    setUsuarioEditando(usuario)
    setNombreEdit(usuario.nombre?.toString() ?? "")
    setApellidoEdit(usuario.apellido?.toString() ?? "")
    const grupoActual = grupos.find((r) => r.grupo === usuario.grupo)
    setGrupoIdEdit(grupoActual?.id_grupo ?? "")
    setEmailEdit(usuario.email ?? "")
    setDniEdit(usuario.dni?.toString() ?? "")
  }, [])

  const cerrarEdicion = useCallback(() => {
    setUsuarioEditando(null)
    setNombreEdit("")
    setApellidoEdit("")
    setGrupoIdEdit("")
    setEmailEdit("")
    setDniEdit("")
  }, [])

  const formularioEditCompleto = useMemo(
    () =>
      nombreEdit.trim() !== "" &&
      apellidoEdit.trim() !== "" &&
      emailEdit.trim() !== "" &&
      dniEdit.trim() !== "" &&
      grupoIdEdit !== "",
    [nombreEdit, apellidoEdit, emailEdit, dniEdit, grupoIdEdit]
  )

  const handleGuardarEdicion = useCallback(async () => {
    if (!usuarioEditando || !formularioEditCompleto) return

    const grupoNuevo = grupos.find((r) => r.id_grupo === grupoIdEdit)
    if (!grupoNuevo) return

    setLoadingEdit(true)
    try {
      const res = await fetchWithConnectionCheck(
        "/api/auth/editar-usuarioProduccion",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: usuarioEditando.id,
            email: emailEdit.trim(),
            nombre: nombreEdit.trim(),
            apellido: apellidoEdit.trim(),
            legajo: usuarioEditando.legajo,
            dni: Number(dniEdit),
            grupo: grupoNuevo.grupo,
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
    grupoIdEdit,
    emailEdit,
    nombreEdit,
    apellidoEdit,
    dniEdit,
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
    grupoIdEdit,
    setGrupoIdEdit,
    formularioEditCompleto,
    handleGuardarEdicion,
    loadingEdit,
    emailEdit,
    setEmailEdit,
    dniEdit,
    setDniEdit,
  }
}
