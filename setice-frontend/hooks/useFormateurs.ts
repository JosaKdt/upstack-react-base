"use client"

import { useState, useEffect, useCallback } from "react"
import type { Formateur } from "@/types"

export function useFormateurs() {
  const [formateurs, setFormateurs] = useState<Formateur[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFormateurs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // ✅ Enlevez les espaces à la fin de l'URL
      const res = await fetch("https://upstack-react-base.onrender.com/api/v1/formateurs")
      
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`)
      }

      const data = await res.json()
      
      console.log("📦 Réponse API complète:", data)
      console.log("📋 Formateurs:", data.data)
      
      // ✅ La réponse est { success: true, data: [...] }
      if (data.success && Array.isArray(data.data)) {
        setFormateurs(data.data)
      } else {
        throw new Error("Format de données invalide")
      }
    } catch (err: any) {
      console.error("❌ Erreur fetch formateurs:", err)
      setError(err.message || "Erreur lors du chargement des formateurs")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFormateurs()
  }, [fetchFormateurs])

  return { formateurs, isLoading, error, refetch: fetchFormateurs }
}