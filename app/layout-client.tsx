"use client"
import Header from "@/components/header/headerPrincipal"

import { Toaster } from "@/components/ui/sonner"

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 grow">{children}</main>
      <Toaster />
    </div>
  )
}
