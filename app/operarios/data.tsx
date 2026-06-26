export const roles = [
  { id_rol: "1", nombre_rol: "Encargado", rol: "encargado-produccion" },
  { id_rol: "2", nombre_rol: "Usuario", rol: "operario" },
]

export type UsuarioEditando = {
  id_operario: number
  nombre: string
  apellido: string
  rol_nombre: string
  legajo: number
}
