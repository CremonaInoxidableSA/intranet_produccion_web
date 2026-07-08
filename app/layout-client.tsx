"use client"
import Header from "@/components/header/headerPrincipal"

import { Toaster } from "@/components/ui/sonner"
import { ConnectionErrorNotifier } from "@/components/ConnectionErrorNotifier"

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ConnectionErrorNotifier />
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Toaster />
    </div>
  )
}
