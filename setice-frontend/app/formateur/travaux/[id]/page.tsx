"use client"

import { useEffect, useState, useCallback, use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, Plus, Calendar, Target, FileText, Users } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssignationModal } from "@/components/travaux/AssignationModal"
import { AssignationsTable } from "@/components/travaux/AssignationsTable"
import { EvaluationModal } from "@/components/travaux/EvaluationModal"
import { api } from "@/lib/api"
import type { Travail, AssignationsListResponse, Etudiant } from "@/types"

interface TravailDetailPageProps {
  params: Promise<{ id: string }>
}

export default function TravailDetailPage({ params }: TravailDetailPageProps) {
  const { id } = use(params)
  const [travail, setTravail] = useState<Travail | null>(null)
  const [assignationsData, setAssignationsData] = useState<AssignationsListResponse | null>(null)
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [evalModalOpen, setEvalModalOpen] = useState(false)
  const [selectedAssignationId, setSelectedAssignationId] = useState<string>("")

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Load travail
      const travailResponse = await api.getTravailById(id)
      if (travailResponse.success && travailResponse.data) {
        setTravail(travailResponse.data)

        // Load étudiants de l'espace pédagogique
        const espaceResponse = await api.getEspaceById(
          travailResponse.data.espacePedagogique.id
        )
        if (espaceResponse.success && espaceResponse.data) {
          setEtudiants(espaceResponse.data.etudiants || [])
        }
      }

      // Load assignations
      const assignationsResponse = await api.getAssignationsByTravail(id)
      if (assignationsResponse.success && assignationsResponse.data) {
        setAssignationsData(assignationsResponse.data)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleEvaluer = (assignationId: string) => {
    setSelectedAssignationId(assignationId)
    setEvalModalOpen(true)
  }

  const handleVoir = (assignationId: string) => {
    setSelectedAssignationId(assignationId)
    // TODO: Open view modal
    console.log("Voir assignation:", assignationId)
  }

  const assignedEtudiantIds = assignationsData?.assignations.map((a) => a.etudiant.id) || []

  const selectedAssignation = assignationsData?.assignations.find(
    (a) => a.id === selectedAssignationId
  )

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-50 w-full rounded-lg" />
          <Skeleton className="h-100 w-full rounded-lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!travail) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Travail non trouvé</p>
          <Link href="/formateur/travaux">
            <Button variant="link">Retour aux travaux</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/formateur/travaux"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Tous mes travaux
          </Link>
        </div>

        {/* Travail Info */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">{travail.titre}</CardTitle>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {travail.type === "INDIVIDUEL" ? "Individuel" : "Collectif"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {travail.bareme} points
                  </span>
                </div>
              </div>
              <Button onClick={() => setAssignModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Assigner
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date limite</p>
                  <p className="font-medium">
                    {format(new Date(travail.dateLimite), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Espace pédagogique</p>
                  <p className="font-medium">
                    {travail.espacePedagogique.matiere.libelle} -{" "}
                    {travail.espacePedagogique.promotion.libelle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assignations</p>
                  <p className="font-medium">
                    {assignationsData?.total || 0} étudiant(s)
                  </p>
                </div>
              </div>
            </div>

            {travail.consignes && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium mb-2">Consignes</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {travail.consignes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="assignations">
          <TabsList>
            <TabsTrigger value="assignations">
              Assignations ({assignationsData?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          </TabsList>
          <TabsContent value="assignations" className="mt-4">
            {assignationsData && assignationsData.assignations.length > 0 ? (
              <AssignationsTable
                data={assignationsData}
                onEvaluer={handleEvaluer}
                onVoir={handleVoir}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune assignation</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Ce travail n'a pas encore été assigné à des étudiants.
                  </p>
                  <Button onClick={() => setAssignModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Assigner un étudiant
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="statistiques" className="mt-4">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Les statistiques seront bientôt disponibles.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AssignationModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        travail={travail}
        etudiants={etudiants}
        assignedEtudiantIds={assignedEtudiantIds}
        onAssignationCreated={loadData}
      />

      {selectedAssignation && (
        <EvaluationModal
          open={evalModalOpen}
          onOpenChange={setEvalModalOpen}
          assignation={selectedAssignation}
          bareme={travail.bareme}
          onEvaluationCreated={loadData}
        />
      )}
    </DashboardLayout>
  )
}
