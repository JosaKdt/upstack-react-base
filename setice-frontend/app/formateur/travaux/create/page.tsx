"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TravailForm } from "@/components/travaux/TravailForm"
import { api } from "@/lib/api"
import type { EspacePedagogique } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreateTravailPage() {
  const [espaces, setEspaces] = useState<EspacePedagogique[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEspaces() {
      const response = await api.getEspacesByFormateur()
      if (response.success && response.data) {
        setEspaces(response.data)
      }
      setIsLoading(false)
    }
    loadEspaces()
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/formateur/travaux"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux travaux
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Créer un travail</h1>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-125 w-full rounded-lg" />
          </div>
        ) : espaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Vous n'avez aucun espace pédagogique assigné.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Contactez le directeur des études pour être assigné à un espace.
            </p>
          </div>
        ) : (
          <TravailForm espaces={espaces} />
        )}
      </div>
    </DashboardLayout>
  )
}
