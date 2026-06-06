"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Star,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Check,
  ChevronLeft,
  Share2,
  Heart,
  Sparkles,
  Calendar,
  Shield,
  Rocket,
  Loader2,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  api,
  apiDestinoToDestination,
  type ApiAvaliacao,
  type ApiDisponibilidade,
} from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import type { Destination, Badge as BadgeType } from "@/types"

const badgeStyles: Record<BadgeType["type"], string> = {
  popular: "bg-primary/20 text-primary border-primary/30",
  new: "bg-accent/20 text-accent border-accent/30",
  lastSeats: "bg-destructive/20 text-destructive border-destructive/30",
  exclusive: "bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border-primary/30",
  promoted: "bg-chart-5/20 text-chart-5 border-chart-5/30",
}

const riskColors: Record<string, string> = {
  Baixo: "text-green-400",
  Moderado: "text-yellow-400",
  Alto: "text-orange-400",
  Extremo: "text-red-400",
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

export default function DestinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { user, openAuthModal } = useAuth()

  const [destination, setDestination] = useState<Destination | null>(null)
  const [reviews, setReviews] = useState<ApiAvaliacao[]>([])
  const [disponibilidades, setDisponibilidades] = useState<ApiDisponibilidade[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [bookingMsg, setBookingMsg] = useState("")

  useEffect(() => {
    const id = parseInt(slug)
    if (isNaN(id)) { router.replace("/explorar"); return }

    Promise.all([
      api.destinos.get(id).then(apiDestinoToDestination),
      api.avaliacoes.listByDestino(id).catch(() => [] as ApiAvaliacao[]),
      api.destinos.disponibilidades(id).catch(() => [] as ApiDisponibilidade[]),
    ])
      .then(([dest, revs, disps]) => {
        setDestination(dest)
        setReviews(revs)
        setDisponibilidades(disps)
      })
      .catch(() => router.replace("/explorar"))
      .finally(() => setLoading(false))
  }, [slug, router])

  const nextDisponibilidade = disponibilidades.find((d) => d.vagas_disponiveis > 0)

  async function handleReservar() {
    if (!user) { openAuthModal(); return }
    if (!destination) return

    setBooking(true)
    setBookingMsg("")
    try {
      await api.reservas.create({
        destino_id: parseInt(destination.id),
        disponibilidade_id: nextDisponibilidade?.id,
        num_passageiros: 1,
      })
      setBookingMsg("Reserva criada com sucesso! Confira no seu dashboard.")
    } catch (err: unknown) {
      setBookingMsg(err instanceof Error ? err.message : "Erro ao criar reserva")
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
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

  if (!destination) return null

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />

        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link href="/explorar">
            <Button variant="ghost" className="glass gap-2">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="absolute top-24 right-4 sm:right-8 z-10 flex gap-2">
          <Button variant="ghost" size="icon" className="glass">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="glass">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {destination.badges.map((badge) => (
                <Badge
                  key={badge.type}
                  variant="outline"
                  className={cn("text-xs font-medium", badgeStyles[badge.type])}
                >
                  {badge.label}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              {destination.name}
            </h1>

            <p className="text-xl text-muted-foreground mb-6 max-w-2xl">{destination.tagline}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-chart-5 text-chart-5" />
                <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({destination.reviewCount} avaliações)</span>
              </div>
              {destination.duration !== "A definir" && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{destination.duration}</span>
                </div>
              )}
              {destination.distance && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{destination.distance}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <AlertTriangle className={cn("h-4 w-4", riskColors[destination.riskLevel])} />
                <span className={riskColors[destination.riskLevel]}>Risco {destination.riskLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="w-full justify-start bg-card/50 p-1 mb-8">
                    <TabsTrigger value="about">Sobre</TabsTrigger>
                    {destination.technicalSpecs.length > 0 && (
                      <TabsTrigger value="specs">Especificações</TabsTrigger>
                    )}
                    {destination.requirements.length > 0 && (
                      <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                    )}
                    <TabsTrigger value="reviews">
                      Avaliações {reviews.length > 0 && `(${reviews.length})`}
                    </TabsTrigger>
                    {disponibilidades.length > 0 && (
                      <TabsTrigger value="disponibilidades">Datas</TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="about" className="space-y-8">
                    {destination.description ? (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Descrição</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {destination.description}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Descrição não disponível.</p>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      {destination.operator && (
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50">
                          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                            <Rocket className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{destination.operator}</div>
                            <div className="text-sm text-muted-foreground">Operadora</div>
                          </div>
                        </div>
                      )}
                      {destination.maxCapacity > 0 && (
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50">
                          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{destination.maxCapacity} passageiros</div>
                            <div className="text-sm text-muted-foreground">Capacidade máxima</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {destination.technicalSpecs.length > 0 && (
                    <TabsContent value="specs" className="space-y-4">
                      <h3 className="text-xl font-semibold">Especificações Técnicas</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {destination.technicalSpecs.map((spec, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center p-4 rounded-xl bg-card/50"
                          >
                            <span className="text-muted-foreground">{spec.label}</span>
                            <span className="font-semibold">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )}

                  {destination.requirements.length > 0 && (
                    <TabsContent value="requirements" className="space-y-4">
                      <h3 className="text-xl font-semibold">Requisitos para Participação</h3>
                      <div className="space-y-3">
                        {destination.requirements.map((req, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-4 rounded-xl bg-card/50"
                          >
                            <Shield className="h-5 w-5 text-primary shrink-0" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
                        <div className="flex items-start gap-4">
                          <AlertTriangle className="h-6 w-6 text-primary shrink-0" />
                          <div>
                            <h4 className="font-semibold mb-2">Aviso Importante</h4>
                            <p className="text-sm text-muted-foreground">
                              Todos os requisitos serão verificados durante o processo de reserva.
                              Reembolso integral disponível caso não seja aprovado.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  <TabsContent value="reviews" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Avaliações</h3>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-chart-5 text-chart-5" />
                        <span className="font-semibold text-lg">
                          {destination.rating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          ({destination.reviewCount} avaliações)
                        </span>
                      </div>
                    </div>

                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="p-6 rounded-xl bg-card/50">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="font-semibold">Usuário #{review.usuario_id}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(review.criado_em)}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {Array.from({ length: review.nota }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-chart-5 text-chart-5" />
                                ))}
                              </div>
                            </div>
                            {review.comentario && (
                              <p className="text-muted-foreground">{review.comentario}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Este destino ainda não possui avaliações.</p>
                        <p className="text-sm">Seja o primeiro a avaliar!</p>
                      </div>
                    )}
                  </TabsContent>

                  {disponibilidades.length > 0 && (
                    <TabsContent value="disponibilidades" className="space-y-4">
                      <h3 className="text-xl font-semibold">Datas Disponíveis</h3>
                      <div className="space-y-3">
                        {disponibilidades.map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-card/50"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-primary" />
                              <span className="font-medium">{formatDate(d.data_partida)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>
                                {d.vagas_disponiveis} / {d.vagas_totais} vagas
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24"
              >
                <div className="glass rounded-2xl p-6 border border-border/50">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{formatPrice(destination.price)}</span>
                      <span className="text-muted-foreground">USD / pessoa</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Parcelável em até 12x</p>
                  </div>

                  <Separator className="mb-6" />

                  {/* Availability */}
                  {nextDisponibilidade ? (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>Próximo lançamento</span>
                        </div>
                        <span className="font-semibold text-sm">
                          {formatDate(nextDisponibilidade.data_partida)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4" />
                          <span>Vagas disponíveis</span>
                        </div>
                        <span className="font-semibold">
                          {nextDisponibilidade.vagas_disponiveis} de{" "}
                          {nextDisponibilidade.vagas_totais}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{
                            width: `${((nextDisponibilidade.vagas_totais - nextDisponibilidade.vagas_disponiveis) / nextDisponibilidade.vagas_totais) * 100}%`,
                          }}
                        />
                      </div>
                      {nextDisponibilidade.vagas_disponiveis <= 3 && (
                        <p className="text-xs text-destructive">Últimas vagas! Reserve agora.</p>
                      )}
                    </div>
                  ) : destination.maxCapacity > 0 ? (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Capacidade: {destination.maxCapacity} passageiros</span>
                      </div>
                    </div>
                  ) : null}

                  {/* CTA */}
                  <div className="space-y-3">
                    {bookingMsg ? (
                      <div
                        className={cn(
                          "p-3 rounded-lg text-sm text-center",
                          bookingMsg.includes("sucesso")
                            ? "bg-green-500/20 text-green-400"
                            : "bg-destructive/20 text-destructive"
                        )}
                      >
                        {bookingMsg}
                      </div>
                    ) : null}

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleReservar}
                      disabled={booking}
                    >
                      {booking ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Reservando...
                        </>
                      ) : user ? (
                        "Reservar Agora"
                      ) : (
                        "Entrar para Reservar"
                      )}
                    </Button>

                    <Link href="/assistente" className="block">
                      <Button variant="outline" size="lg" className="w-full gap-2">
                        <Sparkles className="h-4 w-4" />
                        Perguntar à IA
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-4 w-4" />
                      <span>Cancelamento gratuito até 30 dias antes</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
