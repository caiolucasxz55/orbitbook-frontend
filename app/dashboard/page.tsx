"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Rocket,
  Calendar,
  Star,
  ChevronRight,
  LogOut,
  Loader2,
  User,
  MapPin,
  X,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { api, apiDestinoToDestination, type ApiReserva, type ApiDestino } from "@/lib/api"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDENTE: {
    label: "Pendente",
    color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
    icon: Clock,
  },
  CONFIRMADO: {
    label: "Confirmada",
    color: "bg-green-500/15 text-green-400 border-green-500/25",
    icon: CheckCircle2,
  },
  EM_MISSAO: {
    label: "Em Missão",
    color: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    icon: Rocket,
  },
  CONCLUIDO: {
    label: "Concluída",
    color: "bg-primary/15 text-primary border-primary/25",
    icon: Star,
  },
  CANCELADO: {
    label: "Cancelada",
    color: "bg-destructive/15 text-destructive border-destructive/25",
    icon: X,
  },
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

interface ReviewModalProps {
  reserva: ApiReserva
  destinoNome: string
  onClose: () => void
  onSubmit: (nota: number, comentario: string) => Promise<void>
}

function ReviewModal({ reserva, destinoNome, onClose, onSubmit }: ReviewModalProps) {
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await onSubmit(nota, comentario)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao enviar avaliação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            Avaliar Missão
          </DialogTitle>
          <DialogDescription>
            Como foi sua experiência em <strong>{destinoNome}</strong>?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Star rating */}
          <div>
            <p className="text-sm font-medium mb-3">Sua nota</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNota(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      n <= nota
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground self-center">
                {["", "Péssimo", "Ruim", "Regular", "Bom", "Excelente"][nota]}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Comentário <span className="text-muted-foreground">(opcional)</span>
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Conte como foi a experiência..."
              rows={3}
              className="w-full rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface CancelDialogProps {
  reserva: ApiReserva
  destinoNome: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

function CancelDialog({ reserva, destinoNome, onClose, onConfirm }: CancelDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Cancelar Reserva
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja cancelar a reserva para <strong>{destinoNome}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Manter Reserva
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            {loading ? "Cancelando..." : "Cancelar Reserva"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DashboardPage() {
  const { user, logout, openAuthModal, isLoading: authLoading } = useAuth()
  const [reservas, setReservas] = useState<ApiReserva[]>([])
  const [destinos, setDestinos] = useState<Map<number, ApiDestino>>(new Map())
  const [loadingData, setLoadingData] = useState(false)
  const [reviewingReserva, setReviewingReserva] = useState<ApiReserva | null>(null)
  const [cancelingReserva, setCancelingReserva] = useState<ApiReserva | null>(null)

  useEffect(() => {
    if (!user) return
    setLoadingData(true)
    Promise.all([api.reservas.list(), api.destinos.list()])
      .then(([reservasList, destinosPage]) => {
        setReservas(reservasList)
        setDestinos(new Map(destinosPage.items.map((d) => [d.id, d])))
      })
      .catch(() => {})
      .finally(() => setLoadingData(false))
  }, [user])

  async function handleCancelReserva(reservaId: number) {
    await api.reservas.updateStatus(reservaId, "CANCELADO")
    setReservas((prev) =>
      prev.map((r) => (r.id === reservaId ? { ...r, status: "CANCELADO" } : r))
    )
  }

  async function handleSubmitReview(reservaId: number, nota: number, comentario: string) {
    await api.avaliacoes.create({ booking_id: reservaId, nota, comentario: comentario || undefined })
  }

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
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
            <Rocket className="h-12 w-12 text-primary/60" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Acesse sua conta</h1>
            <p className="text-muted-foreground max-w-xs">
              Faça login para ver seu dashboard, reservas e missões.
            </p>
          </div>
          <Button onClick={openAuthModal} className="gap-2">
            <Rocket className="h-4 w-4" />
            Entrar / Criar Conta
          </Button>
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
    const cfg = statusConfig[reserva.status] ?? statusConfig.PENDENTE
    const StatusIcon = cfg.icon

    const dest = destino ? apiDestinoToDestination(destino) : null
    const canCancel = ["PENDENTE", "CONFIRMADO"].includes(reserva.status)
    const canReview = reserva.status === "CONCLUIDO"

    if (compact) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl overflow-hidden border-border/30 hover:border-primary/30 transition-all"
        >
          <div className="flex items-center gap-4 p-4">
            {/* Image */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-secondary">
              {dest?.heroImage ? (
                <Image src={dest.heroImage} alt={destino?.nome || ""} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-primary/40" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Badge variant="outline" className={cn("text-xs gap-1", cfg.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {cfg.label}
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
                <span className="font-mono text-primary/70">{missionCode}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right hidden sm:block">
                <div className="font-semibold text-sm">{formatPrice(Number(reserva.valor_total))}</div>
              </div>
              {canCancel && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setCancelingReserva(reserva)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {canReview && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-amber-400 hover:text-amber-300"
                  title="Avaliar missão"
                  onClick={() => setReviewingReserva(reserva)}
                >
                  <Star className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl overflow-hidden gradient-border hover:border-primary/30 transition-all"
      >
        <div className="flex flex-col sm:flex-row gap-0">
          {/* Destination image */}
          <div className="relative w-full sm:w-48 h-36 sm:h-auto shrink-0 bg-secondary overflow-hidden">
            {dest?.heroImage ? (
              <Image src={dest.heroImage} alt={destino?.nome || ""} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Rocket className="h-12 w-12 text-primary/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 sm:block hidden" />
          </div>

          <div className="flex-1 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <Badge variant="outline" className={cn("mb-2 gap-1", cfg.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {cfg.label}
                </Badge>
                <h3 className="text-base font-semibold">
                  {destino?.nome || `Destino #${reserva.destino_id}`}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{formatPrice(Number(reserva.valor_total))}</p>
                <p className="text-xs text-muted-foreground">{reserva.num_passageiros} passageiro{reserva.num_passageiros > 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary/60" />
                <span>Partida: {formatDate(reserva.departure_date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary/60" />
                <span>Retorno: {formatDate(reserva.return_date)}</span>
              </div>
              {destino?.distance_km && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary/60" />
                  <span>{Number(destino.distance_km).toLocaleString("pt-BR")} km</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-muted-foreground">
                Código: <span className="text-foreground font-semibold">{missionCode}</span>
              </p>
              <div className="flex items-center gap-2">
                {canCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => setCancelingReserva(reserva)}
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancelar
                  </Button>
                )}
                {canReview && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 h-8 text-amber-400 border-amber-400/30 hover:bg-amber-400/10"
                    onClick={() => setReviewingReserva(reserva)}
                  >
                    <Star className="h-3.5 w-3.5" />
                    Avaliar
                  </Button>
                )}
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
      </motion.div>
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
            className="glass rounded-2xl p-6 sm:p-8 mb-8 border border-border/30"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0">
                <User className="h-10 w-10 text-primary/70" />
                {completedCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-foreground">{completedCount}</span>
                  </div>
                )}
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
                    { value: completedCount, label: "Missões Concluídas", highlight: completedCount > 0 },
                    { value: reservas.length, label: "Total de Reservas", highlight: false },
                    { value: upcoming.length, label: "Próximas Viagens", highlight: upcoming.length > 0 },
                  ].map(({ value, label, highlight }) => (
                    <div key={label}>
                      <div className={cn("text-2xl font-bold", highlight ? "text-gradient" : "")}>{value}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={logout} className="gap-2 shrink-0 border-border/50">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Upcoming missions */}
              {upcoming.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Próximas Missões
                  </h2>
                  {loadingData ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-40 bg-card rounded-2xl animate-pulse border border-border" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {upcoming.map((r) => (
                          <BookingCard key={r.id} reserva={r} />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}

              {/* All bookings */}
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
                      <AnimatePresence>
                        {past.map((r) => <BookingCard key={r.id} reserva={r} compact />)}
                      </AnimatePresence>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-border/50">
                        <Rocket className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Nenhuma missão anterior ainda.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-3">
                    {loadingData ? (
                      <div className="h-28 bg-card rounded-xl animate-pulse border border-border" />
                    ) : reservas.length > 0 ? (
                      <AnimatePresence>
                        {reservas.map((r) => <BookingCard key={r.id} reserva={r} compact />)}
                      </AnimatePresence>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-border/50">
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
              {/* Quick actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass rounded-2xl p-6 border border-border/30"
              >
                <h3 className="font-semibold mb-4">Ações Rápidas</h3>
                <div className="space-y-2.5">
                  <Link href="/explorar" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2 h-9 border-border/50">
                      <Rocket className="h-4 w-4" />
                      Explorar Destinos
                    </Button>
                  </Link>
                  <Link href="/assistente" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2 h-9 border-border/50">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Falar com ARIA
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Stats */}
              {completedCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-2xl p-6 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20"
                >
                  <Rocket className="h-7 w-7 text-primary mb-4" />
                  <div className="text-3xl font-bold mb-1">{completedCount}</div>
                  <p className="text-sm text-muted-foreground">
                    {completedCount === 1 ? "Missão espacial concluída" : "Missões espaciais concluídas"}
                  </p>
                </motion.div>
              )}

              {/* Pending reviews hint */}
              {past.filter((r) => r.status === "CONCLUIDO").length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="rounded-2xl p-5 bg-amber-500/5 border border-amber-500/20"
                >
                  <Star className="h-5 w-5 text-amber-400 mb-2" />
                  <p className="text-sm font-medium mb-1">Avalie suas missões</p>
                  <p className="text-xs text-muted-foreground">
                    Compartilhe sua experiência clicando no ⭐ nas reservas concluídas.
                  </p>
                </motion.div>
              )}

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="glass rounded-2xl p-5 border border-border/30"
              >
                <MessageSquare className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Precisa de ajuda?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Nossa IA está pronta para tirar todas as suas dúvidas sobre as missões.
                </p>
                <Link href="/assistente">
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs gap-1 border-border/50">
                    Falar com ARIA
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Review Modal */}
      {reviewingReserva && (
        <ReviewModal
          reserva={reviewingReserva}
          destinoNome={destinos.get(reviewingReserva.destino_id)?.nome || `Destino #${reviewingReserva.destino_id}`}
          onClose={() => setReviewingReserva(null)}
          onSubmit={(nota, comentario) => handleSubmitReview(reviewingReserva.id, nota, comentario)}
        />
      )}

      {/* Cancel Dialog */}
      {cancelingReserva && (
        <CancelDialog
          reserva={cancelingReserva}
          destinoNome={destinos.get(cancelingReserva.destino_id)?.nome || `Destino #${cancelingReserva.destino_id}`}
          onClose={() => setCancelingReserva(null)}
          onConfirm={() => handleCancelReserva(cancelingReserva.id)}
        />
      )}
    </main>
  )
}
