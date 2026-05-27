"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Rocket,
  Calendar,
  MapPin,
  Clock,
  Award,
  Star,
  ChevronRight,
  Settings,
  LogOut,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { mockUser, orbitPassTiers } from "@/data/user"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
}

const statusLabels: Record<string, string> = {
  confirmed: "Confirmada",
  pending: "Pendente",
  completed: "Concluída",
  cancelled: "Cancelada",
}

const tierColors: Record<string, string> = {
  explorer: "from-blue-500 to-cyan-500",
  pioneer: "from-purple-500 to-pink-500",
  elite: "from-amber-500 to-orange-500",
}

export default function DashboardPage() {
  const user = mockUser
  const currentTier = user.orbitPassTier ? orbitPassTiers[user.orbitPassTier] : null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const daysUntilLaunch = (dateStr: string) => {
    const launch = new Date(dateStr)
    const today = new Date()
    const diff = Math.ceil((launch.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                {currentTier && (
                  <div
                    className={cn(
                      "absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      tierColors[user.orbitPassTier!]
                    )}
                  >
                    <Award className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                  {currentTier && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "bg-gradient-to-r text-white border-0 w-fit",
                        tierColors[user.orbitPassTier!]
                      )}
                    >
                      OrbitPass {currentTier.name}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">
                  Membro desde {formatDate(user.memberSince)}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6">
                  <div>
                    <div className="text-2xl font-bold text-gradient">{user.totalMissions}</div>
                    <div className="text-sm text-muted-foreground">Missões</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient">{user.totalDistance}</div>
                    <div className="text-sm text-muted-foreground">Distância Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient">
                      {user.upcomingBookings.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Próximas Viagens</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Bookings */}
              {user.upcomingBookings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-xl font-bold mb-4">Próximas Missões</h2>
                  <div className="space-y-4">
                    {user.upcomingBookings.map((booking) => {
                      const days = daysUntilLaunch(booking.departureDate)
                      return (
                        <div
                          key={booking.id}
                          className="glass rounded-2xl p-6 gradient-border"
                        >
                          <div className="flex flex-col sm:flex-row gap-6">
                            {/* Image */}
                            <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                              <Image
                                src={booking.destination.heroImage}
                                alt={booking.destination.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <Badge
                                    variant="outline"
                                    className={cn("mb-2", statusColors[booking.status])}
                                  >
                                    {statusLabels[booking.status]}
                                  </Badge>
                                  <h3 className="text-lg font-semibold">
                                    {booking.destination.name}
                                  </h3>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-primary">{days}</div>
                                  <div className="text-xs text-muted-foreground">dias restantes</div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(booking.departureDate)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {booking.destination.launchSite}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {booking.destination.duration}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Código da missão: </span>
                                  <span className="font-mono font-semibold">{booking.missionCode}</span>
                                </div>
                                <Link href={`/destino/${booking.destination.slug}`}>
                                  <Button variant="ghost" size="sm" className="gap-1">
                                    Ver detalhes
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Past Bookings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Tabs defaultValue="past">
                  <TabsList className="bg-card/50 mb-4">
                    <TabsTrigger value="past">Missões Anteriores</TabsTrigger>
                    <TabsTrigger value="all">Todas as Reservas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="past" className="space-y-4">
                    {user.pastBookings.map((booking) => (
                      <div key={booking.id} className="glass rounded-xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={booking.destination.heroImage}
                              alt={booking.destination.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className={cn("text-xs", statusColors[booking.status])}
                              >
                                {statusLabels[booking.status]}
                              </Badge>
                            </div>
                            <h4 className="font-semibold truncate">
                              {booking.destination.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(booking.departureDate)} • {booking.passengers} passageiro{booking.passengers > 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="text-right hidden sm:block">
                            <div className="font-semibold">{formatPrice(booking.totalPrice)}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {booking.missionCode}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-4">
                    {[...user.upcomingBookings, ...user.pastBookings].map((booking) => (
                      <div key={booking.id} className="glass rounded-xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={booking.destination.heroImage}
                              alt={booking.destination.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className={cn("text-xs", statusColors[booking.status])}
                              >
                                {statusLabels[booking.status]}
                              </Badge>
                            </div>
                            <h4 className="font-semibold truncate">
                              {booking.destination.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(booking.departureDate)}
                            </p>
                          </div>
                          <div className="text-right hidden sm:block">
                            <div className="font-semibold">{formatPrice(booking.totalPrice)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* OrbitPass Card */}
              {currentTier && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={cn(
                    "rounded-2xl p-6 text-white bg-gradient-to-br",
                    tierColors[user.orbitPassTier!]
                  )}
                >
                  <div className="flex items-center justify-between mb-6">
                    <Rocket className="h-8 w-8" />
                    <span className="text-sm opacity-80">OrbitPass</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{currentTier.name}</h3>
                  <p className="text-sm opacity-80 mb-6">
                    Renovação automática: ${currentTier.price}/ano
                  </p>
                  <Separator className="bg-white/20 mb-4" />
                  <ul className="space-y-2">
                    {currentTier.benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Star className="h-3 w-3" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-semibold mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <Link href="/explorar" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Rocket className="h-4 w-4" />
                      Explorar Destinos
                    </Button>
                  </Link>
                  <Link href="/assistente" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Star className="h-4 w-4" />
                      Falar com Assistente IA
                    </Button>
                  </Link>
                  <Link href="/comparar" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      Comparar Destinos
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
