"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, MapPin, Users, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Destination, Badge as BadgeType } from "@/types"

interface DestinationCardProps {
  destination: Destination
  index?: number
  variant?: "default" | "compact" | "featured"
}

const badgeStyles: Record<BadgeType["type"], string> = {
  popular: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  new: "bg-accent/15 text-accent border-accent/25",
  lastSeats: "bg-destructive/15 text-destructive border-destructive/25",
  exclusive: "bg-primary/15 text-primary border-primary/25",
  promoted: "bg-amber-500/15 text-amber-400 border-amber-500/25",
}

const categoryLabels: Record<string, string> = {
  suborbital: "Suborbital",
  leo: "Órbita Terrestre",
  lunar: "Lunar",
  mars: "Marte",
  deepspace: "Espaço Profundo",
  training: "Treinamento",
}

const FALLBACK_IMAGE = "/destinations/aurora-orbital-hotel.jpg"

export function DestinationCard({ destination, index = 0, variant = "default" }: DestinationCardProps) {
  const [imgSrc, setImgSrc] = useState(destination.heroImage || FALLBACK_IMAGE)

  const formatPrice = (price: number) => {
    if (price >= 1_000_000_000) return `$${(price / 1_000_000_000).toFixed(1)}B`
    if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(0)}M`
    return `$${(price / 1000).toFixed(0)}K`
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className="group"
      >
        <Link href={`/destino/${destination.slug}`}>
          <div className="flex gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:bg-card/80">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={imgSrc}
                alt={destination.name}
                fill
                onError={() => setImgSrc(FALLBACK_IMAGE)}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {destination.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{destination.tagline}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-semibold text-primary">{formatPrice(destination.price)}</span>
                {destination.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">{destination.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/destino/${destination.slug}`}>
        <div className="bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
          {/* Image */}
          <div className="relative aspect-16/10 overflow-hidden bg-secondary">
            <Image
              src={imgSrc}
              alt={destination.name}
              fill
              onError={() => setImgSrc(FALLBACK_IMAGE)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />

            {/* Category pill */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-background/75 backdrop-blur-sm border border-border/50 text-foreground">
                {categoryLabels[destination.category] ?? destination.category}
              </span>
            </div>

            {/* Badges */}
            {destination.badges.length > 0 && (
              <div className="absolute top-3 right-3">
                <Badge
                  variant="outline"
                  className={cn("text-xs backdrop-blur-sm", badgeStyles[destination.badges[0].type])}
                >
                  {destination.badges[0].label}
                </Badge>
              </div>
            )}

            {/* Price overlay */}
            <div className="absolute bottom-3 right-3">
              <div className="px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-sm border border-border/40">
                <span className="text-sm font-bold">{formatPrice(destination.price)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {destination.name}
              </h3>
              {destination.rating > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{destination.rating.toFixed(1)}</span>
                  {destination.reviewCount > 0 && (
                    <span className="text-xs text-muted-foreground">({destination.reviewCount})</span>
                  )}
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
              {destination.tagline}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {destination.distance && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{destination.distance}</span>
                  </div>
                )}
                {destination.maxCapacity > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{destination.maxCapacity} vagas</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Ver</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
