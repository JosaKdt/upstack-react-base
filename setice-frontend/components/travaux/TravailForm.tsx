"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { EspacePedagogique, TypeTravail } from "@/types"
import { cn } from "@/lib/utils"

const createTravailSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  consignes: z.string().min(5, "Les consignes doivent être précisées"),
  type: z.enum(["INDIVIDUEL", "COLLECTIF"]),
  dateLimite: z.date({
    required_error: "La date limite est requise",
  }).refine(
    (date) => date > new Date(),
    { message: "La date limite doit être dans le futur" }
  ),
  bareme: z.number().min(1, "Le barème doit être supérieur à 0"),
  espacePedagogiqueId: z.string().uuid("Sélectionnez un espace pédagogique"),
})

type CreateTravailFormData = z.infer<typeof createTravailSchema>

interface TravailFormProps {
  espaces: EspacePedagogique[]
  preSelectedEspaceId?: string
}

export function TravailForm({ espaces, preSelectedEspaceId }: TravailFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTravailFormData>({
    resolver: zodResolver(createTravailSchema),
    defaultValues: {
      type: "INDIVIDUEL",
      bareme: 20,
      espacePedagogiqueId: preSelectedEspaceId || "",
    },
  })

  const selectedDate = watch("dateLimite")
  const selectedType = watch("type")
  const selectedEspace = watch("espacePedagogiqueId")

  const onSubmit = async (data: CreateTravailFormData) => {
    setIsSubmitting(true)
    try {
      const response = await api.createTravail({
        titre: data.titre,
        consignes: data.consignes,
        type: data.type as TypeTravail,
        dateLimite: data.dateLimite.toISOString(),
        bareme: data.bareme,
        espacePedagogiqueId: data.espacePedagogiqueId,
      })

      if (response.success) {
        toast.success("Travail créé avec succès")
        router.push("/formateur/travaux")
      } else {
        toast.error(response.error || "Erreur lors de la création du travail")
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Espace pédagogique */}
          <div className="space-y-2">
            <Label htmlFor="espacePedagogiqueId">
              Espace pédagogique <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedEspace}
              onValueChange={(value) => setValue("espacePedagogiqueId", value)}
            >
              <SelectTrigger className={errors.espacePedagogiqueId ? "border-destructive" : ""}>
                <SelectValue placeholder="Sélectionner un espace" />
              </SelectTrigger>
              <SelectContent>
                {espaces.map((espace) => (
                  <SelectItem key={espace.id} value={espace.id}>
                    {espace.matiere.libelle} - {espace.promotion.libelle} ({espace.annee})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.espacePedagogiqueId && (
              <p className="text-sm text-destructive">{errors.espacePedagogiqueId.message}</p>
            )}
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="titre">
              Titre du travail <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titre"
              placeholder="Ex: TP JavaScript - Fonctions"
              {...register("titre")}
              className={errors.titre ? "border-destructive" : ""}
            />
            {errors.titre && (
              <p className="text-sm text-destructive">{errors.titre.message}</p>
            )}
          </div>

          {/* Type de travail */}
          <div className="space-y-2">
            <Label>
              Type de travail <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={selectedType}
              onValueChange={(value) => setValue("type", value as "INDIVIDUEL" | "COLLECTIF")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INDIVIDUEL" id="individuel" />
                <Label htmlFor="individuel" className="cursor-pointer">Individuel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COLLECTIF" id="collectif" />
                <Label htmlFor="collectif" className="cursor-pointer">Collectif</Label>
              </div>
            </RadioGroup>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Consignes */}
          <div className="space-y-2">
            <Label htmlFor="consignes">
              Consignes <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="consignes"
              placeholder="Décrivez les consignes du travail..."
              rows={6}
              {...register("consignes")}
              className={errors.consignes ? "border-destructive" : ""}
            />
            {errors.consignes && (
              <p className="text-sm text-destructive">{errors.consignes.message}</p>
            )}
          </div>

          {/* Date limite et Barème */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date limite */}
            <div className="space-y-2">
              <Label>
                Date limite <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                      errors.dateLimite && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP 'à' HH:mm", { locale: fr })
                    ) : (
                      "Sélectionner une date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        // Ajouter l'heure par défaut (18:00)
                        date.setHours(18, 0, 0, 0)
                        setValue("dateLimite", date)
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateLimite && (
                <p className="text-sm text-destructive">{errors.dateLimite.message}</p>
              )}
            </div>

            {/* Barème */}
            <div className="space-y-2">
              <Label htmlFor="bareme">
                Barème <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bareme"
                  type="number"
                  min={1}
                  {...register("bareme", { valueAsNumber: true })}
                  className={cn("w-24", errors.bareme && "border-destructive")}
                />
                <span className="text-muted-foreground">points</span>
              </div>
              {errors.bareme && (
                <p className="text-sm text-destructive">{errors.bareme.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le travail
        </Button>
      </div>
    </form>
  )
}
