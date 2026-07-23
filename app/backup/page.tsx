"use client"

import { FaRegFileExcel } from "react-icons/fa"
import { BsFiletypeSql } from "react-icons/bs"
import { useState } from "react"

const estilosIconos = "h-12 w-12"

export default function BackUp() {
  const [loading, setLoading] = useState(false)

  const descargarArchivo = async (url: string, nombrePorDefecto: string) => {
    setLoading(true)
    try {
      const res = await fetch(url, { method: "GET" })
      if (!res.ok) throw new Error(`Error ${res.status}`)

      const blob = await res.blob()
      // Obtener nombre del Content-Disposition
      const contentDisposition = res.headers.get("content-disposition")
      let nombreArchivo = nombrePorDefecto
      if (contentDisposition) {
        // Busca filename* (para UTF-8) o filename
        const match = contentDisposition.match(/filename\*?=([^;]+)/i)
        if (match) {
          let raw = match[1].trim()
          // Quitar comillas si existen
          if (raw.startsWith('"') && raw.endsWith('"')) {
            raw = raw.slice(1, -1)
          }
          // Si tiene formato UTF-8''...
          if (raw.includes("UTF-8''")) {
            const parts = raw.split("''")
            if (parts.length === 2) {
              nombreArchivo = decodeURIComponent(parts[1])
            } else {
              nombreArchivo = decodeURIComponent(raw)
            }
          } else {
            nombreArchivo = decodeURIComponent(raw)
          }
        }
      }

      const urlObj = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = urlObj
      a.download = nombreArchivo
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(urlObj)
    } catch (error) {
      console.error("Error al descargar:", error)
      alert("No se pudo descargar el archivo. Revisa la consola.")
    } finally {
      setLoading(false)
    }
  }

  const opciones = [
    {
      id: 1,
      nombre: "EXCEL MASTER",
      onClick: () =>
        descargarArchivo(
          "/api/backup/excelMaster",
          "reporte_master_tareas.xlsx"
        ),
      icono: <FaRegFileExcel className={estilosIconos} />,
    }
  ]

  return (
    <div className="grid h-full w-full grid-cols-2 content-start justify-center gap-5 p-5 md:px-50 md:py-20 xl:flex xl:flex-1 xl:flex-wrap">
      {opciones.map((opcion) => (
        <div
          key={opcion.id}
          onClick={opcion.onClick}
          className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded bg-background2 p-5 text-center transition hover:bg-background4 xl:w-1/6"
        >
          <div>{opcion.icono}</div>
          <div className="text-sm font-semibold xl:text-lg">
            {opcion.nombre}
          </div>
        </div>
      ))}
    </div>
  )
}
