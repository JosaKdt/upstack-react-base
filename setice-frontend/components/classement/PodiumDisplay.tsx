"use client"

import { Trophy, Medal } from "lucide-react"
import type { ClassementEtudiant } from "@/types"

interface PodiumDisplayProps {
  classement: ClassementEtudiant[]
}

export function PodiumDisplay({ classement }: PodiumDisplayProps) {
  const top3 = classement.slice(0, 3)

  if (top3.length === 0) {
    return null
  }

  // Reorder for podium display: [2nd, 1st, 3rd]
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)

  const getMedalColor = (rang: number) => {
    switch (rang) {
      case 1:
        return {
          bg: "bg-gradient-to-b from-amber-300 to-amber-500",
          text: "text-amber-900",
          medal: "text-amber-500",
          shadow: "shadow-amber-200",
        }
      case 2:
        return {
          bg: "bg-gradient-to-b from-gray-300 to-gray-400",
          text: "text-gray-800",
          medal: "text-gray-400",
          shadow: "shadow-gray-200",
        }
      case 3:
        return {
          bg: "bg-gradient-to-b from-amber-600 to-amber-800",
          text: "text-amber-100",
          medal: "text-amber-700",
          shadow: "shadow-amber-300",
        }
      default:
        return {
          bg: "bg-muted",
          text: "text-foreground",
          medal: "text-muted-foreground",
          shadow: "",
        }
    }
  }

  const getHeight = (rang: number) => {
    switch (rang) {
      case 1:
        return "h-36"
      case 2:
        return "h-28"
      case 3:
        return "h-20"
      default:
        return "h-16"
    }
  }

  return (
    <div className="flex items-end justify-center gap-4 py-8">
      {podiumOrder.map((etudiant) => {
        if (!etudiant) return null
        const colors = getMedalColor(etudiant.rang)
        const height = getHeight(etudiant.rang)

        return (
          <div
            key={etudiant.etudiant.id}
            className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${(etudiant.rang - 1) * 100}ms` }}
          >
            {/* Avatar & Medal */}
            <div className="relative mb-3">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${colors.bg} ${colors.shadow} shadow-lg`}
              >
                <span className={`text-xl font-bold ${colors.text}`}>
                  {etudiant.etudiant.prenom.charAt(0)}
                  {etudiant.etudiant.nom.charAt(0)}
                </span>
              </div>
              {etudiant.rang <= 3 && (
                <div className="absolute -top-2 -right-2">
                  {etudiant.rang === 1 ? (
                    <Trophy className={`h-6 w-6 ${colors.medal}`} />
                  ) : (
                    <Medal className={`h-6 w-6 ${colors.medal}`} />
                  )}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="text-center mb-2">
              <p className="font-semibold text-sm">
                {etudiant.etudiant.nom.toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground">
                {etudiant.etudiant.prenom}
              </p>
            </div>

            {/* Stats */}
            <div className="text-center mb-2">
              <p className="font-bold text-lg">{etudiant.totalPoints} pts</p>
              <p className="text-xs text-muted-foreground">
                Moy: {etudiant.moyenneGenerale.toFixed(1)}/20
              </p>
            </div>

            {/* Podium Base */}
            <div
              className={`${height} w-24 ${colors.bg} rounded-t-lg flex items-center justify-center shadow-lg`}
            >
              <span className={`text-3xl font-bold ${colors.text}`}>
                {etudiant.rang}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
