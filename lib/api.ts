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

// --- API Types ---

export interface ApiDestino {
  id: number
  nome: string
  tipo: "SUBORBITAL" | "LEO" | "LUNAR" | "MARTE"
  descricao?: string
  duracao?: number
  altitude?: number
  capacidade_max?: number
  preco_base: number
  nivel_risco?: "BAIXO" | "MODERADO" | "ALTO" | "MUITO_ALTO"
  requisitos?: string
  operadora?: string
  badge?: "POPULAR" | "NOVO" | "ULTIMAS_VAGAS" | "EXCLUSIVO"
  ativo: number
  avaliacao: { media: number; total: number }
}

export interface ApiDisponibilidade {
  id: number
  destino_id: number
  data_partida: string
  vagas_totais: number
  vagas_disponiveis: number
}

export interface ApiReserva {
  id: number
  usuario_id: number
  destino_id: number
  disponibilidade_id?: number
  num_passageiros: number
  valor_total: number
  status: "PENDENTE" | "CONFIRMADO" | "EM_MISSAO" | "CONCLUIDO" | "CANCELADO"
  criado_em: string
  atualizado_em: string
}

export interface ApiAvaliacao {
  id: number
  usuario_id: number
  destino_id: number
  nota: number
  comentario?: string
  criado_em: string
}

export interface ApiUsuario {
  id: number
  nome: string
  email: string
  role: "CLIENTE" | "ADMIN"
  plano: "NENHUM" | "EXPLORER" | "PIONEER" | "ASTRONAUT"
  criado_em: string
}

export interface ApiToken {
  access_token: string
  token_type: string
  usuario: ApiUsuario
}

// --- Adapters ---

const categoryMap: Record<ApiDestino["tipo"], Destination["category"]> = {
  SUBORBITAL: "suborbital",
  LEO: "leo",
  LUNAR: "lunar",
  MARTE: "mars",
}

const riskMap: Record<string, Destination["riskLevel"]> = {
  BAIXO: "Baixo",
  MODERADO: "Moderado",
  ALTO: "Alto",
  MUITO_ALTO: "Extremo",
}

const badgeMap: Record<string, Badge> = {
  POPULAR: { type: "popular", label: "Popular" },
  NOVO: { type: "new", label: "Novo" },
  ULTIMAS_VAGAS: { type: "lastSeats", label: "Últimas Vagas" },
  EXCLUSIVO: { type: "exclusive", label: "Exclusivo" },
}

export function apiDestinoToDestination(d: ApiDestino): Destination {
  const specs: TechnicalSpec[] = []
  if (d.altitude) specs.push({ label: "Altitude", value: `${d.altitude.toLocaleString("pt-BR")} km` })
  if (d.duracao) specs.push({ label: "Duração", value: `${d.duracao}h` })
  if (d.capacidade_max) specs.push({ label: "Capacidade máx.", value: `${d.capacidade_max} passageiros` })
  if (d.operadora) specs.push({ label: "Operadora", value: d.operadora })

  return {
    id: d.id.toString(),
    name: d.nome,
    slug: d.id.toString(),
    tagline: d.descricao?.split(".")[0] || d.nome,
    description: d.descricao || "",
    longDescription: d.descricao || "",
    price: d.preco_base,
    currency: "USD",
    duration: d.duracao ? `${d.duracao}h` : "A definir",
    durationDays: d.duracao ? Math.ceil(d.duracao / 24) : 0,
    distance: d.altitude ? `${d.altitude.toLocaleString("pt-BR")} km` : "",
    riskLevel: riskMap[d.nivel_risco || ""] || "Moderado",
    operator: d.operadora || "Operadora Espacial",
    operatorLogo: "",
    rating: d.avaliacao?.media || 0,
    reviewCount: d.avaliacao?.total || 0,
    availability: d.capacidade_max || 0,
    maxCapacity: d.capacidade_max || 0,
    category: categoryMap[d.tipo] || "suborbital",
    badges: d.badge ? [badgeMap[d.badge]] : [],
    requirements: d.requisitos ? d.requisitos.split(",").map((s) => s.trim()).filter(Boolean) : [],
    highlights: [],
    included: [],
    notIncluded: [],
    technicalSpecs: specs,
    gallery: [],
    heroImage: `/placeholder.svg?height=600&width=1200`,
    launchSite: "Base de Lançamento",
    nextLaunch: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    featured: d.badge === "POPULAR" || d.badge === "EXCLUSIVO",
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
      badge?: string
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

    disponibilidades: (id: number) =>
      request<ApiDisponibilidade[]>(`/destinos/${id}/disponibilidades`),
  },

  reservas: {
    list: () => request<ApiReserva[]>("/reservas/"),

    get: (id: number) => request<ApiReserva>(`/reservas/${id}`),

    create: (data: {
      destino_id: number
      disponibilidade_id?: number
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

    create: (data: { destino_id: number; nota: number; comentario?: string }) =>
      request<ApiAvaliacao>("/avaliacoes/", { method: "POST", body: JSON.stringify(data) }),

    delete: (id: number) => request<null>(`/avaliacoes/${id}`, { method: "DELETE" }),
  },

  usuarios: {
    get: (id: number) => request<ApiUsuario>(`/usuarios/${id}`),

    updatePlano: (id: number, plano: ApiUsuario["plano"]) =>
      request<ApiUsuario>(`/usuarios/${id}/plano?plano=${plano}`, { method: "PATCH" }),
  },

  ai: {
    chat: (messages: Array<{ role: string; content: string }>) =>
      request<{ content: string; suggestions: string[]; recomendacao_id?: number }>(
        "/ai/chat",
        { method: "POST", body: JSON.stringify({ messages }) }
      ),
  },
}
