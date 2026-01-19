"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2, User, Calendar, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"
import type { Etudiant } from "@/types"

interface AssignationForEvaluation {
  id: string
  etudiant: Etudiant
  dateLivraison?: string
}

interface EvaluationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignation: AssignationForEvaluation
  bareme: number
  travailTitre?: string
  onEvaluationCreated: () => void
}

export function EvaluationModal({
  open,
  onOpenChange,
  assignation,
  bareme,
  travailTitre,
  onEvaluationCreated,
}: EvaluationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const evaluationSchema = z.object({
    note: z
      .number()
      .min(0, "La note doit être positive")
      .max(bareme, `La note ne peut dépasser ${bareme}`),
    commentaire: z.string().optional(),
  })

  type EvaluationFormData = z.infer<typeof evaluationSchema>

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      note: Math.round(bareme / 2),
      commentaire: "",
    },
  })

  const currentNote = watch("note")

  const onSubmit = async (data: EvaluationFormData) => {
    setIsSubmitting(true)
    try {
      const response = await api.createEvaluation({
        assignationId: assignation.id,
        note: data.note,
        commentaire: data.commentaire,
      })

      if (response.success) {
        toast.success("Évaluation enregistrée avec succès")
        reset()
        onEvaluationCreated()
        onOpenChange(false)
      } else {
        toast.error(response.error || "Erreur lors de l'évaluation")
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const getNoteColor = (note: number) => {
    const percentage = (note / bareme) * 100
    if (percentage >= 80) return "text-emerald-600"
    if (percentage >= 60) return "text-blue-600"
    if (percentage >= 40) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Évaluer le travail</DialogTitle>
          <DialogDescription>
            {travailTitre && (
              <span className="font-medium text-foreground">{travailTitre}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Student Info */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {assignation.etudiant.user.nom.toUpperCase()}{" "}
                  {assignation.etudiant.user.prenom}
                </p>
                <p className="text-sm text-muted-foreground">
                  {assignation.etudiant.matricule}
                </p>
              </div>
            </div>
            {assignation.dateLivraison && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Livré le{" "}
                  {format(new Date(assignation.dateLivraison), "d MMM yyyy 'à' HH:mm", {
                    locale: fr,
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="space-y-4">
            <Label>Note (sur {bareme})</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Slider
                  value={[currentNote]}
                  onValueChange={(value) => setValue("note", value[0])}
                  max={bareme}
                  min={0}
                  step={0.5}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={bareme}
                    step={0.5}
                    {...register("note", { valueAsNumber: true })}
                    className="w-20 text-center"
                  />
                  <span className="text-muted-foreground">/ {bareme}</span>
                </div>
              </div>
              <div className="text-center">
                <span className={`text-4xl font-bold ${getNoteColor(currentNote)}`}>
                  {currentNote}
                </span>
                <span className="text-xl text-muted-foreground"> / {bareme}</span>
              </div>
            </div>
            {errors.note && (
              <p className="text-sm text-destructive">{errors.note.message}</p>
            )}
          </div>

          {/* Commentaire */}
          <div className="space-y-2">
            <Label htmlFor="commentaire">Commentaire (optionnel)</Label>
            <Textarea
              id="commentaire"
              placeholder="Ajoutez un commentaire pour l'étudiant..."
              rows={4}
              {...register("commentaire")}
            />
          </div>

          {/* Info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Les points seront calculés automatiquement en fonction de la note et du
              barème.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
