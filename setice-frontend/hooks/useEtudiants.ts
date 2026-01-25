"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api" // ou l'endroit où vous exportez votre client API
import type { Etudiant } from "@/types"

export function useEtudiants() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEtudiants = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // ✅ Utiliser votre client API qui gère déjà le token
      const response = await api.getEtudiants()
      
      if (!response.success) {
        throw new Error(response.error || "Impossible de récupérer les étudiants")
      }
      
      const validEtudiants = (response.data || []).filter(
        (e: any) => e?.user?.prenom && e?.user?.nom
      )
      
      setEtudiants(validEtudiants)
    } catch (err: any) {
      console.error("Erreur lors de la récupération des étudiants:", err)
      setError(err.message)
      setEtudiants([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEtudiants()
  }, [fetchEtudiants])

  return { etudiants, isLoading, error, refetch: fetchEtudiants }
}