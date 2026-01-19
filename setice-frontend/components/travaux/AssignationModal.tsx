"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import { Search, Loader2, User, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api"
import type { Etudiant, Travail } from "@/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface AssignationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  travail: Travail
  etudiants: Etudiant[]
  assignedEtudiantIds: string[]
  onAssignationCreated: () => void
}

export function AssignationModal({
  open,
  onOpenChange,
  travail,
  etudiants,
  assignedEtudiantIds,
  onAssignationCreated,
}: AssignationModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEtudiantId, setSelectedEtudiantId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredEtudiants = useMemo(() => {
    return etudiants.filter((etudiant) => {
      const fullName = `${etudiant.user.nom} ${etudiant.user.prenom}`.toLowerCase()
      const query = searchQuery.toLowerCase()
      return (
        fullName.includes(query) ||
        etudiant.matricule.toLowerCase().includes(query) ||
        etudiant.user.email.toLowerCase().includes(query)
      )
    })
  }, [etudiants, searchQuery])

  const handleSubmit = async () => {
    if (!selectedEtudiantId) {
      toast.error("Veuillez sélectionner un étudiant")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await api.createAssignation({
        travailId: travail.id,
        etudiantId: selectedEtudiantId,
      })

      if (response.success) {
        toast.success("Travail assigné avec succès")
        setSelectedEtudiantId("")
        setSearchQuery("")
        onAssignationCreated()
        onOpenChange(false)
      } else {
        toast.error(response.error || "Erreur lors de l'assignation")
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedEtudiantId("")
    setSearchQuery("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Assigner le travail</DialogTitle>
          <DialogDescription className="space-y-1">
            <span className="font-medium text-foreground">{travail.titre}</span>
            <br />
            <span>Type: {travail.type === "INDIVIDUEL" ? "Individuel" : "Collectif"}</span>
            <br />
            <span>
              Date limite: {format(new Date(travail.dateLimite), "d MMM yyyy 'à' HH:mm", { locale: fr })}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un étudiant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Students List */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Étudiants inscrits ({filteredEtudiants.length})
            </Label>
            <ScrollArea className="h-75 rounded-md border">
              <RadioGroup
                value={selectedEtudiantId}
                onValueChange={setSelectedEtudiantId}
                className="p-1"
              >
                {filteredEtudiants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <User className="h-8 w-8 mb-2" />
                    <p className="text-sm">Aucun étudiant trouvé</p>
                  </div>
                ) : (
                  filteredEtudiants.map((etudiant) => {
                    const isAssigned = assignedEtudiantIds.includes(etudiant.id)
                    return (
                      <div
                        key={etudiant.id}
                        className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                          isAssigned
                            ? "bg-muted/50 opacity-60"
                            : selectedEtudiantId === etudiant.id
                            ? "bg-primary/10"
                            : "hover:bg-accent"
                        }`}
                      >
                        <RadioGroupItem
                          value={etudiant.id}
                          id={etudiant.id}
                          disabled={isAssigned}
                        />
                        <Label
                          htmlFor={etudiant.id}
                          className={`flex-1 flex items-center justify-between cursor-pointer ${
                            isAssigned ? "cursor-not-allowed" : ""
                          }`}
                        >
                          <div>
                            <p className="font-medium">
                              {etudiant.user.nom.toUpperCase()} {etudiant.user.prenom}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {etudiant.matricule}
                            </p>
                          </div>
                          {isAssigned && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Assigné
                            </Badge>
                          )}
                        </Label>
                      </div>
                    )
                  })
                )}
              </RadioGroup>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedEtudiantId || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assigner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
