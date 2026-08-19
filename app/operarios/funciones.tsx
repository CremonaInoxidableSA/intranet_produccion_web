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

      if (
        isCreateUserCodeExisteGeneral(data?.code) &&
        typeof data?.id === "string"
      ) {
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
    } catch (error) {
      toast.error(getErrorMessage(error))
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
  const [legajoEdit, setLegajoEdit] = useState("")
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [loadingDetalleEdicion, setLoadingDetalleEdicion] = useState(false)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Operario | null>(
    null
  )
  const [loadingEliminar, setLoadingEliminar] = useState(false)
  const [valoresOriginales, setValoresOriginales] = useState<{
    nombre: string
    apellido: string
    grupoId: string
    email: string
    dni: string
    legajo: string
  } | null>(null)

  const aplicarValoresEdicion = useCallback((usuario: Operario) => {
    const grupoActual = grupos.find(
      (r) =>
        r.grupo.trim().toUpperCase() === usuario.grupo?.trim().toUpperCase()
    )

    const nombreInicial = usuario.nombre?.toString() ?? ""
    const apellidoInicial = usuario.apellido?.toString() ?? ""
    const grupoIdInicial = grupoActual?.id_grupo ?? ""
    const emailInicial = usuario.email ?? ""
    const dniInicial = usuario.dni?.toString() ?? ""
    const legajoInicial = usuario.legajo?.toString() ?? ""

    setNombreEdit(nombreInicial)
    setApellidoEdit(apellidoInicial)
    setGrupoIdEdit(grupoIdInicial)
    setEmailEdit(emailInicial)
    setDniEdit(dniInicial)
    setLegajoEdit(legajoInicial)
    setValoresOriginales({
      nombre: nombreInicial,
      apellido: apellidoInicial,
      grupoId: grupoIdInicial,
      email: emailInicial,
      dni: dniInicial,
      legajo: legajoInicial,
    })
  }, [])

  const abrirEdicion = useCallback(
    async (usuario: Operario) => {
      setUsuarioEditando(usuario)
      aplicarValoresEdicion(usuario)

      if (!usuario.id) return

      setLoadingDetalleEdicion(true)
      try {
        const res = await fetchWithConnectionCheck(
          `/api/auth/detalles-usuarioProduccion?user_id=${usuario.id}`
        )
        const data = await handleApiResponse<Operario>(res, () => "")
        aplicarValoresEdicion({ ...usuario, ...data })
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoadingDetalleEdicion(false)
      }
    },
    [aplicarValoresEdicion]
  )

  const cerrarEdicion = useCallback(() => {
    setUsuarioEditando(null)
    setNombreEdit("")
    setApellidoEdit("")
    setGrupoIdEdit("")
    setEmailEdit("")
    setDniEdit("")
    setLegajoEdit("")
    setValoresOriginales(null)
    setLoadingDetalleEdicion(false)
  }, [])

  const huboCambios = useMemo(() => {
    if (!valoresOriginales) return false
    return (
      nombreEdit !== valoresOriginales.nombre ||
      apellidoEdit !== valoresOriginales.apellido ||
      grupoIdEdit !== valoresOriginales.grupoId ||
      emailEdit !== valoresOriginales.email ||
      dniEdit !== valoresOriginales.dni ||
      legajoEdit !== valoresOriginales.legajo
    )
  }, [
    valoresOriginales,
    nombreEdit,
    apellidoEdit,
    grupoIdEdit,
    emailEdit,
    dniEdit,
    legajoEdit,
  ])

  const formularioEditCompleto = useMemo(() => huboCambios, [huboCambios])

  const handleGuardarEdicion = useCallback(async () => {
    if (!usuarioEditando || !formularioEditCompleto) return

    if (!usuarioEditando.id) {
      toast.error("No se pudo identificar el usuario a editar")
      return
    }

    const grupoNuevo = grupos.find((r) => r.id_grupo === grupoIdEdit)
    if (!grupoNuevo) return

    setLoadingEdit(true)
    try {
      const res = await fetchWithConnectionCheck(
        `/api/auth/editar-usuarioProduccion?user_id=${usuarioEditando.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailEdit.trim(),
            nombre: nombreEdit.trim(),
            apellido: apellidoEdit.trim(),
            legajo: Number(legajoEdit),
            dni: Number(dniEdit),
            grupo: grupoNuevo.grupo,
          }),
        }
      )
      await handleApiResponse(res)
      cerrarEdicion()
      await refetchUsuarios()
    } catch (error) {
      toast.error(getErrorMessage(error))
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
    legajoEdit,
    cerrarEdicion,
    refetchUsuarios,
  ])

  const abrirEliminacion = useCallback(() => {
    if (!usuarioEditando) return
    setUsuarioAEliminar(usuarioEditando)
  }, [usuarioEditando])

  const cerrarEliminacion = useCallback(() => {
    setUsuarioAEliminar(null)
  }, [])

  const handleEliminarUsuario = useCallback(async () => {
    if (!usuarioAEliminar?.id) return

    setLoadingEliminar(true)
    try {
      const res = await fetchWithConnectionCheck(
        `/api/auth/eliminar-usuarioProduccion?user_id=${usuarioAEliminar.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: usuarioAEliminar.id }),
        }
      )
      await handleApiResponse(res)
      cerrarEliminacion()
      cerrarEdicion()
      await refetchUsuarios()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoadingEliminar(false)
    }
  }, [usuarioAEliminar, cerrarEliminacion, cerrarEdicion, refetchUsuarios])

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
    legajoEdit,
    setLegajoEdit,
    usuarioAEliminar,
    abrirEliminacion,
    cerrarEliminacion,
    handleEliminarUsuario,
    loadingEliminar,
    loadingDetalleEdicion,
  }
}
