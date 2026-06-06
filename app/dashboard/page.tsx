"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Rocket,
  Calendar,
  Clock,
  Award,
  Star,
  ChevronRight,
  LogOut,
  Loader2,
  User,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { api, type ApiReserva, type ApiDestino } from "@/lib/api"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  PENDENTE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMADO: "bg-green-500/20 text-green-400 border-green-500/30",
  EM_MISSAO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CONCLUIDO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CANCELADO: "bg-red-500/20 text-red-400 border-red-500/30",
}

const statusLabels: Record<string, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmada",
  EM_MISSAO: "Em Missão",
  CONCLUIDO: "Concluída",
  CANCELADO: "Cancelada",
}

const planColors: Record<string, string> = {
  EXPLORER: "from-blue-500 to-cyan-500",
  PIONEER: "from-purple-500 to-pink-500",
  ASTRONAUT: "from-amber-500 to-orange-500",
}

const planBenefits: Record<string, string[]> = {
  EXPLORER: ["Acesso antecipado a novos destinos", "5% de desconto em reservas", "Suporte prioritário"],
  PIONEER: ["Acesso antecipado a novos destinos", "10% de desconto em reservas", "Suporte VIP", "Sala de espera exclusiva"],
  ASTRONAUT: ["Acesso antecipado a novos destinos", "15% de desconto em reservas", "Concierge dedicado", "Upgrades gratuitos", "Eventos exclusivos"],
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
    month: "long",
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
          <User className="h-16 w-16 text-muted-foreground opacity-40" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Acesse sua conta</h1>
            <p className="text-muted-foreground">Faça login para ver seu dashboard e reservas.</p>
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
  const hasPlan = user.plano !== "NENHUM"

  function BookingCard({ reserva, compact = false }: { reserva: ApiReserva; compact?: boolean }) {
    const destino = destinos.get(reserva.destino_id)
    const missionCode = `OBK-${reserva.id.toString().padStart(6, "0")}`

    if (compact) {
      return (
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className={cn("text-xs", statusColors[reserva.status])}
                >
                  {statusLabels[reserva.status]}
                </Badge>
              </div>
              <h4 className="font-semibold truncate">
                {destino?.nome || `Destino #${reserva.destino_id}`}
              </h4>
              <p className="text-sm text-muted-foreground">
                {formatDate(reserva.criado_em)} • {reserva.num_passageiros} passageiro
                {reserva.num_passageiros > 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="font-semibold">{formatPrice(reserva.valor_total)}</div>
              <div className="text-xs text-muted-foreground font-mono">{missionCode}</div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="glass rounded-2xl p-6 gradient-border">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-48 h-32 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Rocket className="h-12 w-12 text-primary/50" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Badge
                  variant="outline"
                  className={cn("mb-2", statusColors[reserva.status])}
                >
                  {statusLabels[reserva.status]}
                </Badge>
                <h3 className="text-lg font-semibold">
                  {destino?.nome || `Destino #${reserva.destino_id}`}
                </h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(reserva.criado_em)}
              </div>
              {destino?.duracao && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {destino.duracao}h
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Código da missão: </span>
                <span className="font-mono font-semibold">{missionCode}</span>
              </div>
              <Link href={`/destino/${reserva.destino_id}`}>
                <Button variant="ghost" size="sm" className="gap-1">
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
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary/60" />
                </div>
                {hasPlan && (
                  <div
                    className={cn(
                      "absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      planColors[user.plano]
                    )}
                  >
                    <Award className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">{user.nome}</h1>
                  {hasPlan && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "bg-gradient-to-r text-white border-0 w-fit",
                        planColors[user.plano]
                      )}
                    >
                      OrbitPass {user.plano.charAt(0) + user.plano.slice(1).toLowerCase()}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <div className="text-2xl font-bold text-gradient">{completedCount}</div>
                    <div className="text-sm text-muted-foreground">Missões Concluídas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient">{reservas.length}</div>
                    <div className="text-sm text-muted-foreground">Total de Reservas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient">{upcoming.length}</div>
                    <div className="text-sm text-muted-foreground">Próximas Viagens</div>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="icon" onClick={logout} title="Sair">
                <LogOut className="h-4 w-4" />
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
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-xl font-bold mb-4">Próximas Missões</h2>
                  {loadingData ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-40 bg-card rounded-2xl animate-pulse" />
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
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Tabs defaultValue="past">
                  <TabsList className="bg-card/50 mb-4">
                    <TabsTrigger value="past">
                      Missões Anteriores {past.length > 0 && `(${past.length})`}
                    </TabsTrigger>
                    <TabsTrigger value="all">
                      Todas as Reservas {reservas.length > 0 && `(${reservas.length})`}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="past" className="space-y-4">
                    {loadingData ? (
                      <div className="h-32 bg-card rounded-xl animate-pulse" />
                    ) : past.length > 0 ? (
                      past.map((r) => <BookingCard key={r.id} reserva={r} compact />)
                    ) : (
                      <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
                        <Rocket className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>Nenhuma missão anterior ainda.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-4">
                    {loadingData ? (
                      <div className="h-32 bg-card rounded-xl animate-pulse" />
                    ) : reservas.length > 0 ? (
                      reservas.map((r) => <BookingCard key={r.id} reserva={r} compact />)
                    ) : (
                      <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
                        <Rocket className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>Nenhuma reserva encontrada.</p>
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
            <div className="space-y-6">
              {/* OrbitPass Card */}
              {hasPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={cn(
                    "rounded-2xl p-6 text-white bg-gradient-to-br",
                    planColors[user.plano]
                  )}
                >
                  <div className="flex items-center justify-between mb-6">
                    <Rocket className="h-8 w-8" />
                    <span className="text-sm opacity-80">OrbitPass</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">
                    {user.plano.charAt(0) + user.plano.slice(1).toLowerCase()}
                  </h3>
                  <p className="text-sm opacity-80 mb-6">Plano ativo</p>
                  <Separator className="bg-white/20 mb-4" />
                  <ul className="space-y-2">
                    {(planBenefits[user.plano] || []).map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
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
