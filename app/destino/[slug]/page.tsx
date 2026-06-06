"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Star,
  MapPin,
  Users,
  Check,
  ChevronLeft,
  Share2,
  Sparkles,
  Shield,
  Rocket,
  Loader2,
  Minus,
  Plus,
  CalendarDays,
  CheckCircle2,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api, apiDestinoToDestination, type ApiAvaliacao } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import type { Destination, Badge as BadgeType } from "@/types"

const badgeStyles: Record<BadgeType["type"], string> = {
  popular: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  new: "bg-accent/20 text-accent border-accent/30",
  lastSeats: "bg-destructive/20 text-destructive border-destructive/30",
  exclusive: "bg-primary/20 text-primary border-primary/30",
  promoted: "bg-amber-500/20 text-amber-400 border-amber-500/30",
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

const today = () => new Date().toISOString().split("T")[0]
const minReturn = (dep: string) => {
  if (!dep) return today()
  const d = new Date(dep)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

export default function DestinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { user, openAuthModal } = useAuth()

  const [destination, setDestination] = useState<Destination | null>(null)
  const [reviews, setReviews] = useState<ApiAvaliacao[]>([])
  const [loading, setLoading] = useState(true)

  const [passengers, setPassengers] = useState(1)
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [booking, setBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState("")

  useEffect(() => {
    const id = parseInt(slug)
    if (isNaN(id)) {
      router.replace("/explorar")
      return
    }

    Promise.all([
      api.destinos.get(id).then(apiDestinoToDestination),
      api.avaliacoes.listByDestino(id).catch(() => [] as ApiAvaliacao[]),
    ])
      .then(([dest, revs]) => {
        setDestination(dest)
        setReviews(revs)
      })
      .catch(() => router.replace("/explorar"))
      .finally(() => setLoading(false))
  }, [slug, router])

  const totalPrice = destination ? destination.price * passengers : 0

  async function handleReservar() {
    if (!user) {
      openAuthModal()
      return
    }
    if (!destination) return
    if (!departureDate) {
      setBookingError("Selecione a data de partida.")
      return
    }
    if (!returnDate) {
      setBookingError("Selecione a data de retorno.")
      return
    }

    setBooking(true)
    setBookingError("")
    setBookingSuccess(false)
    try {
      await api.reservas.create({
        destino_id: parseInt(destination.id),
        departure_date: departureDate,
        return_date: returnDate,
        num_passageiros: passengers,
      })
      setBookingSuccess(true)
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Erro ao criar reserva")
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
      <section className="relative h-[65vh] min-h-130">
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />

        {/* Back button */}
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link href="/explorar">
            <Button variant="ghost" size="sm" className="glass gap-2 h-9">
              <ChevronLeft className="h-4 w-4" />
              Catálogo
            </Button>
          </Link>
        </div>

        {/* Share */}
        <div className="absolute top-24 right-4 sm:right-8 z-10">
          <Button variant="ghost" size="icon" className="glass h-9 w-9">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-7xl">
            {destination.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {destination.badges.map((badge) => (
                  <Badge
                    key={badge.type}
                    variant="outline"
                    className={cn("text-xs font-medium backdrop-blur-sm", badgeStyles[badge.type])}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
              {destination.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-5 max-w-2xl line-clamp-2">
              {destination.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-5 text-sm">
              {destination.rating > 0 ? (
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({destination.reviewCount} avaliações)</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Sem avaliações ainda</span>
              )}
              {destination.distance && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{destination.distance}</span>
                </div>
              )}
              {destination.maxCapacity > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Até {destination.maxCapacity} passageiros</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="w-full justify-start bg-card/50 border border-border/50 p-1 mb-8">
                    <TabsTrigger value="about" className="flex-1 sm:flex-none">Sobre</TabsTrigger>
                    {destination.technicalSpecs.length > 0 && (
                      <TabsTrigger value="specs" className="flex-1 sm:flex-none">Especificações</TabsTrigger>
                    )}
                    <TabsTrigger value="reviews" className="flex-1 sm:flex-none">
                      Avaliações{reviews.length > 0 ? ` (${reviews.length})` : ""}
                    </TabsTrigger>
                  </TabsList>

                  {/* About tab */}
                  <TabsContent value="about" className="space-y-8">
                    {destination.description && (
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Sobre a Missão</h2>
                        <p className="text-muted-foreground leading-relaxed text-base">
                          {destination.description}
                        </p>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      {destination.maxCapacity > 0 && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/60 border border-border/50">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{destination.maxCapacity} passageiros</div>
                            <div className="text-sm text-muted-foreground">Capacidade máxima</div>
                          </div>
                        </div>
                      )}
                      {destination.distance && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/60 border border-border/50">
                          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                            <MapPin className="h-6 w-6 text-accent" />
                          </div>
                          <div>
                            <div className="font-semibold">{destination.distance}</div>
                            <div className="text-sm text-muted-foreground">Distância da Terra</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* What's included */}
                    <div className="p-6 rounded-2xl bg-card/60 border border-border/50">
                      <div className="flex items-start gap-4">
                        <Shield className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-2">Política de Cancelamento</h3>
                          <p className="text-sm text-muted-foreground">
                            Cancelamento gratuito até 30 dias antes da data de partida. Após isso,
                            aplica-se tarifa de cancelamento proporcional.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Specs tab */}
                  {destination.technicalSpecs.length > 0 && (
                    <TabsContent value="specs" className="space-y-4">
                      <h2 className="text-xl font-semibold">Especificações Técnicas</h2>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {destination.technicalSpecs.map((spec, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 rounded-xl bg-card/60 border border-border/50"
                          >
                            <span className="text-sm text-muted-foreground">{spec.label}</span>
                            <span className="font-semibold text-sm">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )}

                  {/* Reviews tab */}
                  <TabsContent value="reviews" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Avaliações</h2>
                      {destination.rating > 0 && (
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-lg">{destination.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground text-sm">({destination.reviewCount})</span>
                        </div>
                      )}
                    </div>

                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="p-5 rounded-2xl bg-card/60 border border-border/50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-primary">
                                    {review.usuario_id ?? "?"}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium">Viajante #{review.usuario_id}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {review.criado_em ? formatDate(review.criado_em) : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < review.nota
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-muted-foreground/30"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.comentario && (
                              <p className="text-sm text-muted-foreground">{review.comentario}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-14 text-muted-foreground bg-card/40 rounded-2xl border border-border/50">
                        <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Sem avaliações ainda</p>
                        <p className="text-sm mt-1">Seja o primeiro a avaliar após sua missão!</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24"
              >
                {bookingSuccess ? (
                  /* Success state */
                  <div className="glass rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Reserva Confirmada!</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Sua missão espacial foi reservada com sucesso. Confira os detalhes no painel.
                    </p>
                    <div className="space-y-3">
                      <Link href="/dashboard">
                        <Button className="w-full gap-2">
                          <Rocket className="h-4 w-4" />
                          Ver no Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setBookingSuccess(false)
                          setDepartureDate("")
                          setReturnDate("")
                          setPassengers(1)
                        }}
                      >
                        Nova Reserva
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Booking form */
                  <div className="glass rounded-2xl p-6">
                    {/* Price */}
                    <div className="mb-5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{formatPrice(destination.price)}</span>
                        <span className="text-muted-foreground text-sm">USD / pessoa</span>
                      </div>
                      {destination.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{destination.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">
                            ({destination.reviewCount} avaliações)
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator className="mb-5" />

                    <div className="space-y-4">
                      {/* Departure date */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Data de Partida
                        </label>
                        <input
                          type="date"
                          value={departureDate}
                          min={today()}
                          onChange={(e) => {
                            setDepartureDate(e.target.value)
                            if (returnDate && returnDate <= e.target.value) setReturnDate("")
                          }}
                          className="w-full h-10 px-3 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                        />
                      </div>

                      {/* Return date */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Data de Retorno
                        </label>
                        <input
                          type="date"
                          value={returnDate}
                          min={departureDate ? minReturn(departureDate) : today()}
                          disabled={!departureDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Passengers */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                          <Users className="h-3.5 w-3.5" />
                          Passageiros
                        </label>
                        <div className="flex items-center justify-between h-10 px-3 rounded-lg bg-card border border-border">
                          <button
                            onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                            disabled={passengers <= 1}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-semibold text-sm">
                            {passengers} {passengers === 1 ? "adulto" : "adultos"}
                          </span>
                          <button
                            onClick={() =>
                              setPassengers((p) => Math.min(destination.maxCapacity || 10, p + 1))
                            }
                            disabled={passengers >= (destination.maxCapacity || 10)}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price breakdown */}
                    {passengers > 1 && (
                      <div className="mt-4 p-3 rounded-xl bg-secondary/50 text-sm">
                        <div className="flex justify-between text-muted-foreground mb-1">
                          <span>{formatPrice(destination.price)} × {passengers}</span>
                          <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t border-border/50 pt-2 mt-2">
                          <span>Total</span>
                          <span className="text-primary">{formatPrice(totalPrice)}</span>
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {bookingError && (
                      <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {bookingError}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-5 space-y-3">
                      <Button
                        size="lg"
                        className="w-full font-semibold"
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
                          Perguntar à ARIA
                        </Button>
                      </Link>
                    </div>

                    {/* Trust signals */}
                    <div className="mt-5 pt-5 border-t border-border/50 space-y-2">
                      {[
                        "Cancelamento gratuito até 30 dias antes",
                        "Pagamento seguro e criptografado",
                        "Suporte 24/7 dedicado",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-green-400 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
