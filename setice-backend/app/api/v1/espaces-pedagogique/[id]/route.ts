/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from "next/server"
import { getEspacePedagogique } from "@/src/services/espace-pedagogique.service"
import { requireRole } from "@/src/middleware/auth.middleware"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(req, ["DIRECTEUR_ETUDES", "FORMATEUR"])

    const espace = await getEspacePedagogique(params.id)

    if (!espace) {
      return NextResponse.json({ success: false, error: "Espace pédagogique introuvable" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: espace }, { status: 200 })
  } catch (e: any) {
    let status = 400
    const error = e.message

    if (e.message === "MISSING_TOKEN") status = 401
    if (e.message === "INVALID_TOKEN" || e.message === "INVALID_TOKEN_FORMAT") status = 401
    if (e.message === "FORBIDDEN") status = 403

    return NextResponse.json({ success: false, error }, { status })
  }
}