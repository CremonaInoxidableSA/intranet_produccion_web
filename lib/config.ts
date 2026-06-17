export const urlConfig = {
  /* URL globales */
  externalUrl: "https://creminox.com",
  intranetUrl: process.env.NEXT_PUBLIC_INTRANET_URL ?? "http://localhost:3000",
  homeUrl: "/",

  /* URL de módulos */
  cargaUrl: "/cargar-tarea",
  operariosUrl: "/operarios",
  productosUrl: "/productos",
  monitoreoUrl: "/monitoreo",
  backupUrl: "/backup",
} as const