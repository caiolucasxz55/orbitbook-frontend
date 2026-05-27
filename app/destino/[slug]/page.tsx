"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import {
  Star,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Check,
  X,
  ChevronLeft,
  Share2,
  Heart,
  Sparkles,
  Calendar,
  Shield,
  Rocket,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { destinations, reviews } from "@/data/destinations"
import { cn } from "@/lib/utils"
import type { Badge as BadgeType } from "@/types"

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

export default function DestinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const destination = destinations.find((d) => d.slug === slug)

  if (!destination) {
    notFound()
  }

  const destinationReviews = reviews.filter((r) => r.destinationId === destination.id)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Image */}
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

        {/* Back button */}
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link href="/explorar">
            <Button variant="ghost" className="glass gap-2">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="absolute top-24 right-4 sm:right-8 z-10 flex gap-2">
          <Button variant="ghost" size="icon" className="glass">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="glass">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Badges */}
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

            <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
              {destination.tagline}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-chart-5 text-chart-5" />
                <span className="font-semibold">{destination.rating}</span>
                <span className="text-muted-foreground">
                  ({destination.reviewCount} avaliações)
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{destination.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{destination.distance}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className={cn("h-4 w-4", riskColors[destination.riskLevel])} />
                <span className={riskColors[destination.riskLevel]}>
                  Risco {destination.riskLevel}
                </span>
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
              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6">Galeria</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {destination.gallery.map((image, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative rounded-xl overflow-hidden",
                        index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-video"
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${destination.name} - Imagem ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="w-full justify-start bg-card/50 p-1 mb-8">
                    <TabsTrigger value="about">Sobre</TabsTrigger>
                    <TabsTrigger value="specs">Especificações</TabsTrigger>
                    <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                    <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="space-y-8">
                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Descrição</h3>
                      <div className="prose prose-invert max-w-none">
                        {destination.longDescription.split("\n\n").map((paragraph, index) => (
                          <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Destaques</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {destination.highlights.map((highlight, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 rounded-xl bg-card/50"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Included / Not Included */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Incluso</h3>
                        <ul className="space-y-3">
                          {destination.included.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Não Incluso</h3>
                        <ul className="space-y-3">
                          {destination.notIncluded.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="specs" className="space-y-6">
                    <h3 className="text-xl font-semibold">Especificações Técnicas</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {destination.technicalSpecs.map((spec, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 rounded-xl bg-card/50"
                        >
                          <span className="text-muted-foreground">{spec.label}</span>
                          <span className="font-semibold">{spec.value}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-8" />

                    {/* Operator info */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Operadora</h3>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50">
                        <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                          <Rocket className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{destination.operator}</div>
                          <div className="text-sm text-muted-foreground">
                            Local de lançamento: {destination.launchSite}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-6">
                    <h3 className="text-xl font-semibold">Requisitos para Participação</h3>
                    <div className="space-y-3">
                      {destination.requirements.map((req, index) => (
                        <div
                          key={index}
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
                            Uma avaliação médica completa será realizada antes da confirmação final. 
                            Reembolso integral disponível caso não seja aprovado.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Avaliações</h3>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-chart-5 text-chart-5" />
                        <span className="font-semibold text-lg">{destination.rating}</span>
                        <span className="text-muted-foreground">
                          ({destination.reviewCount} avaliações)
                        </span>
                      </div>
                    </div>

                    {destinationReviews.length > 0 ? (
                      <div className="space-y-4">
                        {destinationReviews.map((review) => (
                          <div key={review.id} className="p-6 rounded-xl bg-card/50">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-12 h-12 rounded-full bg-cover bg-center"
                                  style={{ backgroundImage: `url(${review.userAvatar})` }}
                                />
                                <div>
                                  <div className="font-semibold flex items-center gap-2">
                                    {review.userName}
                                    {review.verified && (
                                      <Badge variant="secondary" className="text-xs">
                                        Verificado
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Viajou em {formatDate(review.tripDate)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 fill-chart-5 text-chart-5"
                                  />
                                ))}
                              </div>
                            </div>
                            <h4 className="font-semibold mb-2">{review.title}</h4>
                            <p className="text-muted-foreground">{review.content}</p>
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
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{formatPrice(destination.price)}</span>
                      <span className="text-muted-foreground">USD / pessoa</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Parcelável em até 12x
                    </p>
                  </div>

                  <Separator className="mb-6" />

                  {/* Availability */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Próximo lançamento</span>
                      </div>
                      <span className="font-semibold">{formatDate(destination.nextLaunch)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span>Vagas disponíveis</span>
                      </div>
                      <span className="font-semibold">
                        {destination.availability} de {destination.maxCapacity}
                      </span>
                    </div>
                  </div>

                  {/* Availability bar */}
                  <div className="mb-6">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{
                          width: `${((destination.maxCapacity - destination.availability) / destination.maxCapacity) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {destination.availability <= 3
                        ? "🔥 Últimas vagas! Reserve agora."
                        : "Vagas preenchendo rapidamente"}
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Link href={`/checkout/${destination.slug}`} className="block">
                      <Button size="lg" className="w-full">
                        Reservar Agora
                      </Button>
                    </Link>
                    <Link href="/assistente" className="block">
                      <Button variant="outline" size="lg" className="w-full gap-2">
                        <Sparkles className="h-4 w-4" />
                        Perguntar à IA
                      </Button>
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4" />
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
