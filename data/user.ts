import { User, Booking } from "@/types"
import { destinations } from "./destinations"

export const mockUser: User = {
  id: "user-001",
  name: "Alexandre Costa",
  email: "alexandre@email.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  memberSince: "2024-06-15",
  orbitPassTier: "pioneer",
  totalMissions: 2,
  totalDistance: "512 km",
  upcomingBookings: [
    {
      id: "booking-001",
      destinationId: "leo-station-01",
      destination: destinations.find(d => d.id === "leo-station-01")!,
      userId: "user-001",
      status: "confirmed",
      passengers: 1,
      totalPrice: 12500000,
      departureDate: "2026-09-20",
      createdAt: "2026-03-15",
      missionCode: "ORB-2026-0920"
    }
  ],
  pastBookings: [
    {
      id: "booking-002",
      destinationId: "suborbital-01",
      destination: destinations.find(d => d.id === "suborbital-01")!,
      userId: "user-001",
      status: "completed",
      passengers: 1,
      totalPrice: 450000,
      departureDate: "2025-11-15",
      createdAt: "2025-08-20",
      missionCode: "SUB-2025-1115"
    },
    {
      id: "booking-003",
      destinationId: "suborbital-01",
      destination: destinations.find(d => d.id === "suborbital-01")!,
      userId: "user-001",
      status: "completed",
      passengers: 2,
      totalPrice: 900000,
      departureDate: "2026-02-10",
      createdAt: "2025-12-01",
      missionCode: "SUB-2026-0210"
    }
  ]
}

export const orbitPassTiers = {
  explorer: {
    name: "Explorer",
    price: 999,
    benefits: [
      "5% de desconto em todas as reservas",
      "Acesso antecipado a novos destinos",
      "Suporte prioritário 24/7",
      "Newsletter exclusiva"
    ]
  },
  pioneer: {
    name: "Pioneer",
    price: 4999,
    benefits: [
      "10% de desconto em todas as reservas",
      "Acesso a destinos exclusivos",
      "Concierge espacial dedicado",
      "Upgrade de treinamento",
      "Eventos VIP com astronautas",
      "Kit de astronauta premium"
    ]
  },
  elite: {
    name: "Elite",
    price: 24999,
    benefits: [
      "15% de desconto em todas as reservas",
      "Primeiro acesso a missões históricas",
      "Concierge 24/7 dedicado",
      "Treinamento particular",
      "Experiências exclusivas na Terra",
      "Suíte premium garantida",
      "Membro fundador da comunidade"
    ]
  }
}
