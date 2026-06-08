import type { Destination, Badge, TechnicalSpec } from "@/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("orbit_token")
}

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
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
    throw new ApiError(res.status, error.detail || `Erro ${res.status}`)
  }
  if (res.status === 204) return null as T
  return res.json()
}

// --- API Types ---

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

export interface ApiDestinoPageOut {
  items: ApiDestino[]
  total: number
  page: number
  pages: number
  limit: number
}

export interface ApiDestinoRecomendado {
  id: number
  nome: string
  tipo?: string
  descricao: string
  preco_base: number
  distance_km: number
  image_url: string
  capacidade_max: number
  avaliacao?: { media: number; total: number }
  ativo: number
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

// --- Image mapping ---

const nameImageMap: Array<[string[], string]> = [
  // Destinos reais específicos — must come before generic keywords
  [["blue origin", "new shepard"],               "/destinations/space-hotel-suite.jpg"],
  [["virgin galactic", "vss", "spaceship two"],  "/destinations/helios-solar-station.jpg"],
  [["axiom station", "axiom"],                   "/destinations/tiangong-station.jpg"],
  [["crew dragon", "spacex crew"],               "/destinations/aurora-orbital-hotel.jpg"],
  [["artemis lunar gateway"],                    "/destinations/lunar-gateway-station.jpg"],
  [["mars colony", "mars alpha", "colony alpha"],"/destinations/mars-base-alpha.jpg"],
  // Destinos genéricos / ficcionais
  [["aurora"],                                   "/destinations/aurora-orbital-hotel.jpg"],
  [["tiangong"],                                 "/destinations/tiangong-station.jpg"],
  [["selene"],                                   "/destinations/selene-resort.jpg"],
  [["artemis"],                                  "/destinations/artemis-expedition.jpg"],
  [["apollo"],                                   "/destinations/apollo-moon-base.jpg"],
  [["gateway", "lunar gateway"],                 "/destinations/lunar-gateway-station.jpg"],
  [["ares prime", "ares"],                       "/destinations/ares-prime-colony.jpg"],
  [["europa"],                                   "/destinations/europa-deep-aqua.jpg"],
  [["helios"],                                   "/destinations/helios-solar-station.jpg"],
  [["kraken", "titan"],                          "/destinations/kraken-titan-colony.jpg"],
  [["celestial hub", "celestial"],               "/destinations/celestial-hub.jpg"],
  [["dyson"],                                    "/destinations/dyson-sphere.jpg"],
  [["stanford", "torus"],                        "/destinations/stanford-torus.jpg"],
  [["asteroid", "oasis"],                        "/destinations/asteroid-oasis.jpg"],
  [["jupiter"],                                  "/destinations/jupiter-cruise.jpg"],
  [["venus"],                                    "/destinations/venus-cloud-city.jpg"],
  [["oneill", "o'neill", "cylinder", "cilindro"],"/destinations/oneill-cylinder.jpg"],
  [["marte", "mars base"],                       "/destinations/mars-base-alpha.jpg"],
  [["rover", "mare serenitat"],                  "/destinations/lunar-rover-tour.jpg"],
  [["greenhouse", "estufa", "fazenda"],          "/destinations/mars-greenhouse.jpg"],
]

const categoryFallbacks: Record<string, string> = {
  leo: "/destinations/aurora-orbital-hotel.jpg",
  lunar: "/destinations/selene-resort.jpg",
  mars: "/destinations/mars-base-alpha.jpg",
  deepspace: "/destinations/celestial-hub.jpg",
  suborbital: "/destinations/space-hotel-suite.jpg",
  training: "/destinations/artemis-expedition.jpg",
}

function getLocalImage(nome: string, category: string): string {
  const n = nome.toLowerCase()
  for (const [keywords, img] of nameImageMap) {
    if (keywords.some((kw) => n.includes(kw))) return img
  }
  return categoryFallbacks[category] || "/destinations/aurora-orbital-hotel.jpg"
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
  const category = inferCategory(d.tipo)

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

  const heroImage = d.image_url || getLocalImage(d.nome, category)

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
    category,
    badges,
    requirements: [],
    highlights: [],
    included: [],
    notIncluded: [],
    technicalSpecs: specs,
    gallery: [],
    heroImage,
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
      page?: number
      limit?: number
    }) => {
      const merged = { limit: 50, ...params }
      const query =
        "?" +
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(merged)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)])
          )
        )
      return request<ApiDestinoPageOut>(`/destinos/${query}`)
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
      request<{
        content: string
        suggestions: string[]
        recomendacao_id?: number
        destinos_recomendados: ApiDestinoRecomendado[]
      }>("/ai/chat", { method: "POST", body: JSON.stringify({ messages }) }),
  },
}
