"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"

function ActivateForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleActivate = async () => {
    if (!password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const res = await fetch(`${API_URL}/api/v1/etudiants/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      toast.success("Compte active avec succes !")

      setTimeout(() => {
        const loginUrl = `/login?activated=${Date.now()}`
        window.location.href = loginUrl
      }, 1500)

    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'activation")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 className="text-xl font-semibold mb-4">Activation du compte</h1>

      <Input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-3"
        disabled={isLoading}
        autoComplete="new-password"
      />
      <Input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mb-4"
        disabled={isLoading}
        autoComplete="new-password"
      />

      <Button onClick={handleActivate} disabled={isLoading} className="w-full">
        {isLoading ? "Activation en cours..." : "Activer mon compte"}
      </Button>
    </div>
  )
}

export default function ActivatePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Suspense fallback={<div>Chargement...</div>}>
        <ActivateForm />
      </Suspense>
    </div>
  )
}