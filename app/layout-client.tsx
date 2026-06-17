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
      <div className="sticky top-0 left-0 z-50 w-full">
        <Header />
      </div>
      <main className="flex w-full min-w-0 grow">{children}</main>
      <Toaster />
    </div>
  )
}
