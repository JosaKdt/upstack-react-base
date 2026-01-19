import { Badge } from "@/components/ui/badge"
import type { AssignationStatut } from "@/lib/types"

interface StatusBadgeProps {
  status: AssignationStatut
  note?: number
  bareme?: number
}

const statusConfig: Record<
  AssignationStatut,
  { label: string; className: string }
> = {
  ASSIGNE: {
    label: "Assigne",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  LIVRE: {
    label: "Livre",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  EVALUE: {
    label: "Evalue",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
}

export function StatusBadge({ status, note, bareme }: StatusBadgeProps) {
  const config = statusConfig[status]

  if (status === "EVALUE" && note !== undefined && bareme !== undefined) {
    return (
      <Badge variant="outline" className={config.className}>
        {note}/{bareme}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
