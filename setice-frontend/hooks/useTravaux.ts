"use client"

import { useState, useEffect, useCallback } from "react"
import type { Travail } from "@/types"
import { api } from "@/lib/api"

export function useTravaux(espaceId: string) {
  const [travaux, setTravaux] = useState<Travail[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTravaux = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await api.getTravauxByEspace(espaceId)
      if (!res.success) throw new Error(res.error || "Impossible de récupérer les travaux")
      setTravaux(res.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [espaceId])

  useEffect(() => {
    fetchTravaux()
  }, [fetchTravaux])

  const createTravail = async (data: {
    titre: string
    consignes: string
    type: string
    dateLimite: string
    bareme: number
  }) => {
    try {
      const res = await api.createTravail({ ...data, espacePedagogiqueId: espaceId })
      if (!res.success) throw new Error(res.error || "Erreur lors de la création du travail")
      setTravaux((prev) => [...prev, res.data!])
      return res.data
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  return { travaux, isLoading, error, refetch: fetchTravaux, createTravail }
}
