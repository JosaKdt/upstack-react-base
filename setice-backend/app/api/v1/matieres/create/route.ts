"use server"

import { NextRequest, NextResponse } from "next/server"
import { createMatiere, listMatieres } from "@/src/services/matiere.service"
import { createMatiereSchema } from "@/src/schemas/matiere.schema"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const matieres = await listMatieres()
    return NextResponse.json(
      { success: true, data: matieres },
      { status: 200 }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = createMatiereSchema.parse(body)
    const matiere = await createMatiere(data)

    return NextResponse.json(
      { success: true, data: matiere },
      { status: 201 }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    let status = 400
    if (err.message === "MATIERE_ALREADY_EXISTS") status = 409

    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}