"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Rocket,
  Calendar,
  Star,
  ChevronRight,
  LogOut,
  Loader2,
  User,
  MapPin,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { api, type ApiReserva, type ApiDestino } from "@/lib/api"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  PENDENTE: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  CONFIRMADO: "bg-green-500/15 text-green-400 border-green-500/25",
  EM_MISSAO: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  CONCLUIDO: "bg-primary/15 text-primary border-primary/25",
  CANCELADO: "bg-destructive/15 text-destructive border-destructive/25",
}

const statusLabels: Record<string, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmada",
  EM_MISSAO: "Em Missão",
  CONCLUIDO: "Concluída",
  CANCELADO: "Cancelada",
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price)

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export default function DashboardPage() {
  const { user, logout, openAuthModal, isLoading: authLoading } = useAuth()
  const [reservas, setReservas] = useState<ApiReserva[]>([])
  const [destinos, setDestinos] = useState<Map<number, ApiDestino>>(new Map())
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoadingData(true)

    Promise.all([api.reservas.list(), api.destinos.list()])
      .then(([reservasList, destinosList]) => {
        setReservas(reservasList)
        setDestinos(new Map(destinosList.map((d) => [d.id, d])))
      })
      .catch(() => {})
      .finally(() => setLoadingData(false))
  }, [user])

  if (authLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center h-[80vh] gap-6 text-center px-4">
          <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground opacity-40" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Acesse sua conta</h1>
            <p className="text-muted-foreground">Faça login para ver seu dashboard e suas reservas.</p>
          </div>
          <Button onClick={openAuthModal}>Entrar / Criar Conta</Button>
        </div>
        <Footer />
      </main>
    )
  }

  const upcoming = reservas.filter((r) =>
    ["PENDENTE", "CONFIRMADO", "EM_MISSAO"].includes(r.status)
  )
  const past = reservas.filter((r) => ["CONCLUIDO", "CANCELADO"].includes(r.status))
  const completedCount = reservas.filter((r) => r.status === "CONCLUIDO").length

  function BookingCard({ reserva, compact = false }: { reserva: ApiReserva; compact?: boolean }) {
    const destino = destinos.get(reserva.destino_id)
    const missionCode = `OBK-${reserva.id.toString().padStart(6, "0")}`

    if (compact) {
      return (
        <div className="glass rounded-xl p-4 transition-all hover:border-primary/30">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Badge variant="outline" className={cn("text-xs", statusColors[reserva.status])}>
                  {statusLabels[reserva.status]}
                </Badge>
              </div>
              <h4 className="font-semibold text-sm truncate">
                {destino?.nome || `Destino #${reserva.destino_id}`}
              </h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(reserva.departure_date)}
                </span>
                <span>{reserva.num_passageiros} pax</span>
              </div>
            </div>
            <div className="text-right hidden sm:block shrink-0">
              <div className="font-semibold text-sm">{formatPrice(Number(reserva.valor_total))}</div>
              <div className="text-xs text-muted-foreground font-mono">{missionCode}</div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="glass rounded-2xl p-5 gradient-border transition-all hover:border-primary/30">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:w-44 h-28 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Rocket className="h-10 w-10 text-primary/50" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Badge variant="outline" className={cn("mb-2", statusColors[reserva.status])}>
                  {statusLabels[reserva.status]}
                </Badge>
                <h3 className="text-base font-semibold">
                  {destino?.nome || `Destino #${reserva.destino_id}`}
                </h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Partida: {formatDate(reserva.departure_date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Retorno: {formatDate(reserva.return_date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{reserva.num_passageiros} passageiro{reserva.num_passageiros > 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">Código: </span>
                <span className="font-mono text-sm font-semibold">{missionCode}</span>
              </div>
              <Link href={`/destino/${reserva.destino_id}`}>
                <Button variant="ghost" size="sm" className="gap-1 h-8">
                  Ver destino
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <User className="h-10 w-10 text-primary/70" />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold">{user.nome}</h1>
                  {user.role && (
                    <Badge variant="outline" className="w-fit text-xs">
                      {user.role}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-5">{user.email}</p>
                <div className="flex flex-wrap gap-6">
                  {[
                    { value: completedCount, label: "Missões Concluídas" },
                    { value: reservas.length, label: "Total de Reservas" },
                    { value: upcoming.length, label: "Próximas Viagens" },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <div className="text-2xl font-bold text-gradient">{value}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2 shrink-0"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming */}
              {upcoming.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-lg font-semibold mb-4">Próximas Missões</h2>
                  {loadingData ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-36 bg-card rounded-2xl animate-pulse border border-border" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcoming.map((r) => (
                        <BookingCard key={r.id} reserva={r} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* All Bookings Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Tabs defaultValue={past.length > 0 ? "past" : "all"}>
                  <TabsList className="bg-card/50 border border-border/50 mb-4">
                    <TabsTrigger value="past">
                      Anteriores{past.length > 0 ? ` (${past.length})` : ""}
                    </TabsTrigger>
                    <TabsTrigger value="all">
                      Todas{reservas.length > 0 ? ` (${reservas.length})` : ""}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="past" className="space-y-3">
                    {loadingData ? (
                      <div className="h-28 bg-card rounded-xl animate-pulse border border-border" />
                    ) : past.length > 0 ? (
                      past.map((r) => <BookingCard key={r.id} reserva={r} compact />)
                    ) : (
                      <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
                        <Rocket className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Nenhuma missão anterior ainda.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-3">
                    {loadingData ? (
                      <div className="h-28 bg-card rounded-xl animate-pulse border border-border" />
                    ) : reservas.length > 0 ? (
                      reservas.map((r) => <BookingCard key={r.id} reserva={r} compact />)
                    ) : (
                      <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
                        <Rocket className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Nenhuma reserva encontrada.</p>
                        <Link href="/explorar">
                          <Button variant="outline" size="sm" className="mt-4">
                            Explorar Destinos
                          </Button>
                        </Link>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-semibold mb-4">Ações Rápidas</h3>
                <div className="space-y-2.5">
                  <Link href="/explorar" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2 h-9">
                      <Rocket className="h-4 w-4" />
                      Explorar Destinos
                    </Button>
                  </Link>
                  <Link href="/assistente" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2 h-9">
                      <Star className="h-4 w-4" />
                      Falar com ARIA
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Stats card */}
              {completedCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-2xl p-6 bg-linear-to-br from-primary/20 to-accent/20 border border-primary/20"
                >
                  <Rocket className="h-7 w-7 text-primary mb-4" />
                  <div className="text-3xl font-bold mb-1">{completedCount}</div>
                  <p className="text-sm text-muted-foreground">
                    {completedCount === 1
                      ? "Missão espacial concluída"
                      : "Missões espaciais concluídas"}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
