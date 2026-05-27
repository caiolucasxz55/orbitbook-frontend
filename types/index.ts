export interface Destination {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  longDescription: string
  price: number
  currency: string
  duration: string
  durationDays: number
  distance: string
  riskLevel: "Baixo" | "Moderado" | "Alto" | "Extremo"
  operator: string
  operatorLogo: string
  rating: number
  reviewCount: number
  availability: number
  maxCapacity: number
  category: "suborbital" | "leo" | "lunar" | "mars" | "deepspace" | "training"
  badges: Badge[]
  requirements: string[]
  highlights: string[]
  included: string[]
  notIncluded: string[]
  technicalSpecs: TechnicalSpec[]
  gallery: string[]
  heroImage: string
  launchSite: string
  nextLaunch: string
  featured: boolean
}

export interface Badge {
  type: "popular" | "new" | "lastSeats" | "exclusive" | "promoted"
  label: string
}

export interface TechnicalSpec {
  label: string
  value: string
}

export interface Review {
  id: string
  destinationId: string
  userName: string
  userAvatar: string
  rating: number
  date: string
  title: string
  content: string
  verified: boolean
  tripDate: string
}

export interface Booking {
  id: string
  destinationId: string
  destination: Destination
  userId: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  passengers: number
  totalPrice: number
  departureDate: string
  createdAt: string
  missionCode: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  memberSince: string
  orbitPassTier: "explorer" | "pioneer" | "elite" | null
  totalMissions: number
  totalDistance: string
  upcomingBookings: Booking[]
  pastBookings: Booking[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  suggestions?: string[]
}

export interface FilterState {
  category: string[]
  priceRange: [number, number]
  duration: string[]
  riskLevel: string[]
  operator: string[]
  sortBy: "price-asc" | "price-desc" | "rating" | "duration" | "popularity"
}
