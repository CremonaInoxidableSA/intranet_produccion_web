const hosts = {
  localHost: `http://${process.env.NEXT_PUBLIC_IP}:${process.env.NEXT_PUBLIC_PORT}`,
}

export const urlConfig = {
  /* URL globales */
  externalUrl: "https://creminox.com",
  intranetUrl: process.env.NEXT_PUBLIC_INTRANET_URL ?? "http://localhost:3000",
  homeUrl: "/",

  /* URL de módulos */
  cargaUrl: `${process.env.CARGAR_TAREA}`,
  operariosUrl: `${process.env.OPERARIOS}`,
  registrosUrl: `${process.env.REGISTROS}`,
  productosUrl: `${process.env.PRODUCTOS}`,
  monitoreoUrl: `${process.env.MONITOREO}`,
  backupUrl: `${process.env.BACKUP}`
} as const

/* 
Listado de variables de entorno
CARGAR_TAREA
OPERARIOS
REGISTROS
PRODUCTOS
MONITOREO
BACKUP
*/