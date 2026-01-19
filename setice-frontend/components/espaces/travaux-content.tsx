"use client"

import { useState, useMemo } from "react"
import { Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useTravaux } from "@/hooks/useTravaux"
import { CreateTravailModal } from "@/components/modals/create-travail-modal"
import type { Travail, TypeTravail } from "@/types"

interface TravauxContentProps {
  espaceId: string
}

export function TravauxContent({ espaceId }: TravauxContentProps) {
  const { travaux, isLoading, refetch } = useTravaux(espaceId)

  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<TypeTravail | "all">("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredTravaux = useMemo(() => {
    return travaux.filter((t) => {
      const matchesSearch =
        !searchQuery || t.titre.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === "all" || t.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [travaux, searchQuery, typeFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Travaux</h2>
          <p className="mt-1 text-sm text-muted-foreground">Gérez les travaux de cet espace</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un travail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TypeTravail | "all")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Type de travail" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="DEVOIR">Devoir</SelectItem>
            <SelectItem value="PROJET">Projet</SelectItem>
            <SelectItem value="EXAMEN">Examen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste / Skeleton / Empty */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4">
              <Skeleton className="mb-2 h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ) : filteredTravaux.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-border">
          <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Aucun travail</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {travaux.length === 0
              ? "Créez votre premier travail pour commencer"
              : "Modifiez vos filtres pour voir plus de résultats"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTravaux.map((travail: Travail) => (
            <div
              key={travail.id}
              className="rounded-lg border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{travail.titre}</p>
                <p className="text-sm text-muted-foreground">
                  {travail.type} - Date limite : {new Date(travail.dateLimite).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 sm:mt-0 sm:flex sm:items-center sm:gap-4">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                  {travail.statut}
                </span>
                <span className="text-sm text-muted-foreground">Barème: {travail.bareme}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal création */}
      <CreateTravailModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={refetch}
      />
    </div>
  )
}
