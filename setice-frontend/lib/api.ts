import type {
  AuthResponse,
  ApiResponse,
  Formateur,
  Promotion,
  Etudiant,
  Matiere,
  EspacePedagogique,
  CreateFormateurData,
  CreatePromotionData,
  CreateEtudiantData,
  CreateMatiereData,
  CreateEspaceData,
  AssignFormateurData,
  AddEtudiantsData,
  AddEtudiantsResponse,
  Travail,
  AssignationsListResponse,
  Evaluation,
  CreateEvaluationData,
  EtudiantEvaluationsResponse,
  ClassementResponse,
  CreateAssignationData,
} from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

class ApiClient {
  getTravaux: any
  
  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("setice_token")
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getToken()

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    try {
      console.log("➡️ API Request:", endpoint, config)
      const response = await fetch(`${API_URL}${endpoint}`, config)
      console.log("⬅️ API Response status:", response.status, response)
      const data = await response.json()
      
      console.log("⬅️ API Response body:", data)

      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré, redirect login
          if (typeof window !== "undefined") {
            localStorage.removeItem("setice_token")
            localStorage.removeItem("setice_user")
            window.location.href = "/login"
          }
        }
        return { success: false, error: data.error || "Erreur serveur" }
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      return { success: false, error: "Erreur réseau" }
    }
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<{
      token: string
      user: AuthResponse["data"] extends { user: infer U } ? U : never
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return response as AuthResponse
  }

  // Formateurs
  async getFormateurs(): Promise<ApiResponse<Formateur[]>> {
    return this.request<Formateur[]>("/formateurs/create")
  }

  async createFormateur(data: CreateFormateurData): Promise<ApiResponse<Formateur>> {
    return this.request<Formateur>("/formateurs/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Promotions
  async getPromotions(): Promise<ApiResponse<Promotion[]>> {
    return this.request<Promotion[]>("/promotions/create")
  }

  async createPromotion(data: CreatePromotionData): Promise<ApiResponse<Promotion>> {
    return this.request<Promotion>("/promotions/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Étudiants
  async getEtudiants(): Promise<ApiResponse<Etudiant[]>> {
    return this.request<Etudiant[]>("/etudiants/create")
  }

  async createEtudiant(data: CreateEtudiantData): Promise<ApiResponse<Etudiant>> {
    return this.request<Etudiant>("/etudiants/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Matières
  async getMatieres(): Promise<ApiResponse<Matiere[]>> {
    return this.request<Matiere[]>("/matieres/create")
  }

  async createMatiere(data: CreateMatiereData): Promise<ApiResponse<Matiere>> {
    return this.request<Matiere>("/matieres/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Espaces Pédagogiques
  async getEspaces(): Promise<ApiResponse<EspacePedagogique[]>> {
    return this.request<EspacePedagogique[]>("/espaces-pedagogique/list")
  }


  async getEspacesByFormateur(): Promise<ApiResponse<EspacePedagogique[]>> {
  return this.request<EspacePedagogique[]>(
    "/formateurs/espaces"
  )
}


  async createEspace(data: CreateEspaceData): Promise<ApiResponse<EspacePedagogique>> {
    return this.request<EspacePedagogique>("/espaces-pedagogique/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async assignFormateur(data: AssignFormateurData): Promise<ApiResponse<void>> {
    return this.request<void>("/espaces-pedagogique/assign-formateur", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async addEtudiants(data: AddEtudiantsData): Promise<ApiResponse<AddEtudiantsResponse>> {
    return this.request<AddEtudiantsResponse>("/espaces-pedagogique/add-etudiants", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Dans src/lib/api.ts, dans la classe ApiClient
async getEspaceById(id: string): Promise<ApiResponse<EspacePedagogique>> {
  return this.request<EspacePedagogique>(`/espaces-pedagogique/${id}`)
}

// Travaux
async getTravauxByEspace(espaceId: string): Promise<ApiResponse<Travail[]>> {
  return this.request<Travail[]>(`/travaux/create`)
}

async createTravail(data: {
  titre: string
  consignes: string
  type: string
  dateLimite: string
  bareme: number
  espacePedagogiqueId: string
}): Promise<ApiResponse<Travail>> {
  return this.request<Travail>("/travaux/create", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Assignations (US 6.1, 7.1)
  async createAssignation(data: CreateAssignationData): Promise<ApiResponse<{
    id: string
    travail: { id: string; titre: string; dateLimite: string }
    etudiant: { id: string; nom: string; prenom: string; email: string }
    statut: string
    dateAssignation: string
  }>> {
    return this.request("/assignations/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
   
  async getTravailById(travailId: string): Promise<ApiResponse<Travail>> {
    return this.request<Travail>(`/travaux/${travailId}`)
  }

  

  async getAssignationsByTravail(travailId: string): Promise<ApiResponse<AssignationsListResponse>> {
    return this.request<AssignationsListResponse>(`/assignations/list?travailId=${travailId}`)
  }

  // Evaluations (US 9.1)
  async createEvaluation(data: CreateEvaluationData): Promise<ApiResponse<Evaluation>> {
    return this.request<Evaluation>("/evaluations/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Étudiant (US 10.1)
  async getEtudiantEvaluations(etudiantId: string): Promise<ApiResponse<EtudiantEvaluationsResponse>> {
    return this.request<EtudiantEvaluationsResponse>(`/etudiants/${etudiantId}/evaluations`)
  }

  // Classement (US 11.1)
  async getClassementPromotion(promotionId: string): Promise<ApiResponse<ClassementResponse>> {
    return this.request<ClassementResponse>(`/classements/promotions/${promotionId}`)
  }


}

export const api = new ApiClient()
