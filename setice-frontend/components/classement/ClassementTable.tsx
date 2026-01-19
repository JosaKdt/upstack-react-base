"use client"

import { TrendingUp, TrendingDown, Minus, Trophy, Medal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { ClassementEtudiant } from "@/types"

interface ClassementTableProps {
  classement: ClassementEtudiant[]
}

export function ClassementTable({ classement }: ClassementTableProps) {
  const getRangBadge = (rang: number) => {
    switch (rang) {
      case 1:
        return (
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="font-bold text-amber-600">1</span>
          </div>
        )
      case 2:
        return (
          <div className="flex items-center gap-1">
            <Medal className="h-4 w-4 text-gray-400" />
            <span className="font-bold text-gray-600">2</span>
          </div>
        )
      case 3:
        return (
          <div className="flex items-center gap-1">
            <Medal className="h-4 w-4 text-amber-700" />
            <span className="font-bold text-amber-700">3</span>
          </div>
        )
      default:
        return <span className="text-muted-foreground">{rang}</span>
    }
  }

  const getRowClass = (rang: number) => {
    switch (rang) {
      case 1:
        return "bg-amber-50"
      case 2:
        return "bg-gray-50"
      case 3:
        return "bg-amber-50/50"
      default:
        return ""
    }
  }

  const getTrendIcon = (progression: string) => {
    if (!progression || progression === "=" || progression === "-") {
      return <Minus className="h-4 w-4 text-muted-foreground" />
    }

    const value = parseInt(progression)
    if (value > 0) {
      return (
        <div className="flex items-center gap-1 text-emerald-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs font-medium">+{value}</span>
        </div>
      )
    } else if (value < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="h-4 w-4" />
          <span className="text-xs font-medium">{value}</span>
        </div>
      )
    }

    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getMoyenneBadge = (moyenne: number) => {
    if (moyenne >= 16) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          {moyenne.toFixed(1)}
        </Badge>
      )
    }
    if (moyenne >= 14) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          {moyenne.toFixed(1)}
        </Badge>
      )
    }
    if (moyenne >= 10) {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          {moyenne.toFixed(1)}
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        {moyenne.toFixed(1)}
      </Badge>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Rang</TableHead>
            <TableHead>Étudiant</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right">Moyenne</TableHead>
            <TableHead className="text-right">Tendance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classement.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Aucun étudiant dans le classement
              </TableCell>
            </TableRow>
          ) : (
            classement.map((item) => (
              <TableRow key={item.etudiant.id} className={getRowClass(item.rang)}>
                <TableCell>{getRangBadge(item.rang)}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {item.etudiant.nom.toUpperCase()} {item.etudiant.prenom}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {item.etudiant.matricule}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {item.totalPoints}
                </TableCell>
                <TableCell className="text-right">
                  {getMoyenneBadge(item.moyenneGenerale)}
                </TableCell>
                <TableCell className="text-right">
                  {getTrendIcon(item.progression)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
