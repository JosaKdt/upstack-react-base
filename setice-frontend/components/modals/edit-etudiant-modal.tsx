"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useEtudiants, usePromotions } from "@/hooks/use-data"
import type { Etudiant } from "@/types"

interface EditEtudiantModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  etudiant: Etudiant | null
}

export function EditEtudiantModal({ open, onOpenChange, etudiant }: EditEtudiantModalProps) {
  const { mutate } = useEtudiants()
  const { promotions, isLoading: loadingPromotions } = usePromotions()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    promotionId: "",
  })

  useEffect(() => {
    if (etudiant) {
      setFormData({
        nom: etudiant.user.nom,
        prenom: etudiant.user.prenom,
        email: etudiant.user.email,
        promotionId: etudiant.promotion?.id || "",
      })
      setErrors({})
    }
  }, [etudiant])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nom || formData.nom.length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caracteres"
    }
    if (!formData.prenom || formData.prenom.length < 2) {
      newErrors.prenom = "Le prenom doit contenir au moins 2 caracteres"
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide"
    }
    if (!formData.promotionId) {
      newErrors.promotionId = "Veuillez selectionner une promotion"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!etudiant) return
    if (!validate()) return

    setLoading(true)
    setErrors({})

    const result = await api.updateEtudiant(etudiant.id, formData)

    if (result.success) {
      toast.success("Etudiant modifie avec succes !")
      mutate()
      onOpenChange(false)
    } else {
      if (result.error?.toLowerCase().includes("email") || result.error === "USER_ALREADY_EXISTS") {
        setErrors({ email: "Cet email est deja utilise" })
      } else if (result.error?.toLowerCase().includes("promotion")) {
        setErrors({ promotionId: "Promotion invalide" })
      } else {
        toast.error(result.error || "Erreur lors de la modification")
      }
    }

    setLoading(false)
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l'etudiant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nom">
              Nom <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-nom"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              className={errors.nom ? "border-destructive" : ""}
              autoFocus
            />
            {errors.nom && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.nom}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-prenom">
              Prenom <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-prenom"
              value={formData.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
              className={errors.prenom ? "border-destructive" : ""}
            />
            {errors.prenom && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.prenom}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-promotionId">
              Promotion <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.promotionId} onValueChange={(value) => handleChange("promotionId", value)}>
              <SelectTrigger className={errors.promotionId ? "border-destructive" : ""}>
                <SelectValue placeholder={loadingPromotions ? "Chargement..." : "Selectionner une promotion"} />
              </SelectTrigger>
              <SelectContent>
                {promotions.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.code} - {p.libelle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.promotionId && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.promotionId}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}