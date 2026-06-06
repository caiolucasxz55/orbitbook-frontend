import type { Destination, Badge, TechnicalSpec } from "@/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("orbit_token")
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error.detail || `Erro ${res.status}`)
  }
  if (res.status === 204) return null as T
  return res.json()
}

// --- API Types (match DDL v3 / schemas.py) ---

export interface ApiDestino {
  id: number
  nome: string
  tipo?: string
  descricao: string
  capacidade_max: number
  preco_base: number
  distance_km: number
  image_url: string
  ativo: number
  avaliacao?: { media: number; total: number }
}

export interface ApiReserva {
  id: number
  usuario_id: number
  destino_id: number
  departure_date: string
  return_date: string
  num_passageiros: number
  valor_total: number
  status: "PENDENTE" | "CONFIRMADO" | "EM_MISSAO" | "CONCLUIDO" | "CANCELADO"
  criado_em: string
}

export interface ApiAvaliacao {
  id: number
  booking_id: number
  usuario_id?: number
  destino_id?: number
  nota: number
  comentario?: string
  criado_em: string
}

export interface ApiUsuario {
  id: number
  nome: string
  email: string
  role?: string
  criado_em: string
}

export interface ApiToken {
  access_token: string
  token_type: string
  usuario: ApiUsuario
}

// --- Adapters ---

function inferCategory(tipo?: string): Destination["category"] {
  const t = (tipo || "").toUpperCase()
  if (t.includes("SUBORBITAL")) return "suborbital"
  if (t.includes("LEO") || t.includes("ORBITAL") || t.includes("TERRESTRE")) return "leo"
  if (t.includes("LUNAR") || t.includes("LUA")) return "lunar"
  if (t.includes("MARTE") || t.includes("MARS")) return "mars"
  if (t.includes("DEEP") || t.includes("PROFUNDO")) return "deepspace"
  if (t.includes("TRAIN") || t.includes("TREIN")) return "training"
  return "suborbital"
}

export function apiDestinoToDestination(d: ApiDestino): Destination {
  const specs: TechnicalSpec[] = [
    { label: "Distância", value: `${Number(d.distance_km).toLocaleString("pt-BR")} km` },
    { label: "Capacidade máx.", value: `${d.capacidade_max} passageiros` },
    ...(d.tipo ? [{ label: "Tipo de missão", value: d.tipo }] : []),
  ]

  const badges: Badge[] = []
  const rating = d.avaliacao?.media || 0
  const reviews = d.avaliacao?.total || 0
  if (reviews === 0) badges.push({ type: "new", label: "Novo" })
  else if (rating >= 4.5) badges.push({ type: "popular", label: "Popular" })
  if (d.capacidade_max <= 4) badges.push({ type: "exclusive", label: "Exclusivo" })

  return {
    id: d.id.toString(),
    name: d.nome,
    slug: d.id.toString(),
    tagline: d.descricao?.split(".")[0] || d.nome,
    description: d.descricao || "",
    longDescription: d.descricao || "",
    price: Number(d.preco_base),
    currency: "USD",
    duration: "",
    durationDays: 0,
    distance: `${Number(d.distance_km).toLocaleString("pt-BR")} km`,
    riskLevel: "Moderado",
    operator: "",
    operatorLogo: "",
    rating,
    reviewCount: reviews,
    availability: d.capacidade_max,
    maxCapacity: d.capacidade_max,
    category: inferCategory(d.tipo),
    badges,
    requirements: [],
    highlights: [],
    included: [],
    notIncluded: [],
    technicalSpecs: specs,
    gallery: [],
    heroImage: d.image_url || `/placeholder.svg?height=600&width=1200`,
    launchSite: "Base de Lançamento",
    nextLaunch: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    featured: rating >= 4 || reviews >= 3,
  }
}

export const reservaStatusMap: Record<ApiReserva["status"], string> = {
  PENDENTE: "pending",
  CONFIRMADO: "confirmed",
  EM_MISSAO: "confirmed",
  CONCLUIDO: "completed",
  CANCELADO: "cancelled",
}

// --- API Client ---

export const api = {
  auth: {
    register: (data: { nome: string; email: string; senha: string }) =>
      request<ApiToken>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

    login: (email: string, senha: string) =>
      request<ApiToken>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      }),

    me: () => request<ApiUsuario>("/auth/me"),
  },

  destinos: {
    list: (params?: {
      tipo?: string
      preco_min?: number
      preco_max?: number
      busca?: string
    }) => {
      const query = params
        ? "?" +
          new URLSearchParams(
            Object.fromEntries(
              Object.entries(params)
                .filter(([, v]) => v !== undefined)
                .map(([k, v]) => [k, String(v)])
            )
          )
        : ""
      return request<ApiDestino[]>(`/destinos/${query}`)
    },

    get: (id: number) => request<ApiDestino>(`/destinos/${id}`),
  },

  reservas: {
    list: () => request<ApiReserva[]>("/reservas/"),

    get: (id: number) => request<ApiReserva>(`/reservas/${id}`),

    create: (data: {
      destino_id: number
      departure_date: string
      return_date: string
      num_passageiros?: number
    }) => request<ApiReserva>("/reservas/", { method: "POST", body: JSON.stringify(data) }),

    updateStatus: (id: number, status: ApiReserva["status"]) =>
      request<ApiReserva>(`/reservas/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),

    delete: (id: number) => request<null>(`/reservas/${id}`, { method: "DELETE" }),
  },

  avaliacoes: {
    listByDestino: (destinoId: number) =>
      request<ApiAvaliacao[]>(`/avaliacoes/destino/${destinoId}`),

    create: (data: { booking_id: number; nota: number; comentario?: string }) =>
      request<ApiAvaliacao>("/avaliacoes/", { method: "POST", body: JSON.stringify(data) }),

    delete: (id: number) => request<null>(`/avaliacoes/${id}`, { method: "DELETE" }),
  },

  usuarios: {
    get: (id: number) => request<ApiUsuario>(`/usuarios/${id}`),
  },

  ai: {
    chat: (messages: Array<{ role: string; content: string }>) =>
      request<{ content: string; suggestions: string[]; recomendacao_id?: number }>(
        "/ai/chat",
        { method: "POST", body: JSON.stringify({ messages }) }
      ),
  },
}
