export const grupos = [
  {
    id_grupo: "1",
    nombre_grupo: "GRUPO_ENCARGADOS_PRODUCCION",
    grupo: "GRUPO_ENCARGADOS_PRODUCCION",
  },
  {
    id_grupo: "2",
    nombre_grupo: "GRUPO_OPERARIOS_PRODUCCION",
    grupo: "GRUPO_OPERARIOS_PRODUCCION",
  },
]

export const CREATE_USER_CODE_EXISTE_GENERAL = "EXISTE_GENERAL"
export const CREATE_USER_CODE_EXISTE_PRODUCCION = "EXISTE_PRODUCCION"
export const CREATE_USER_CODE_EXISTE_GENERAL_ALIAS =
  "CREATE_USER_CODE_EXISTE_GENERAL"
export const CREATE_USER_CODE_EXISTE_PRODUCCION_ALIAS =
  "CREATE_USER_CODE_EXISTE_PRODUCCION"

export interface CrearUsuarioResponse {
  success?: boolean
  code?: string
  detail?: string
  id?: string
}

export interface UsuarioPendienteGrupo {
  id: string
  grupo: string
  detail: string
}

export function getGrupoById(grupoId: string) {
  return grupos.find((grupo) => grupo.id_grupo === grupoId)
}

export function isCreateUserCodeExisteGeneral(code?: string) {
  return (
    code === CREATE_USER_CODE_EXISTE_GENERAL ||
    code === CREATE_USER_CODE_EXISTE_GENERAL_ALIAS
  )
}

export function isCreateUserCodeExisteProduccion(code?: string) {
  return (
    code === CREATE_USER_CODE_EXISTE_PRODUCCION ||
    code === CREATE_USER_CODE_EXISTE_PRODUCCION_ALIAS
  )
}

export function getGrupoDisplay(grupo?: string): string {
  if (!grupo) return ""
  switch (grupo.trim().toUpperCase()) {
    case "GRUPO_ENCARGADOS_PRODUCCION":
      return "ENCARGADO"
    case "GRUPO_OPERARIOS_PRODUCCION":
      return "OPERARIO"
    default:
      return grupo
  }
}
