"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Clock, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Destination, Badge as BadgeType } from "@/types"

interface DestinationCardProps {
  destination: Destination
  index?: number
  variant?: "default" | "compact"
}

const badgeStyles: Record<BadgeType["type"], string> = {
  popular: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  new: "bg-accent/10 text-accent border-accent/20",
  lastSeats: "bg-destructive/10 text-destructive border-destructive/20",
  exclusive: "bg-primary/10 text-primary border-primary/20",
  promoted: "bg-chart-5/10 text-chart-5 border-chart-5/20",
}

export function DestinationCard({ destination, index = 0, variant = "default" }: DestinationCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `$${(price / 1000000000).toFixed(1)}B`
    }
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(0)}M`
    }
    return `$${(price / 1000).toFixed(0)}K`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/destino/${destination.slug}`}>
        <div className="bg-card rounded-xl overflow-hidden border border-border transition-colors hover:border-primary/30">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={destination.heroImage}
              alt={destination.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 rounded text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground">
                {destination.category === "suborbital" && "Suborbital"}
                {destination.category === "leo" && "Órbita Terrestre"}
                {destination.category === "lunar" && "Lunar"}
                {destination.category === "mars" && "Marte"}
                {destination.category === "deepspace" && "Espaço Profundo"}
                {destination.category === "training" && "Treinamento"}
              </span>
            </div>

            {/* Badges */}
            {destination.badges.length > 0 && (
              <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
                {destination.badges.slice(0, 1).map((badge) => (
                  <Badge
                    key={badge.type}
                    variant="outline"
                    className={cn("text-xs", badgeStyles[badge.type])}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="absolute bottom-3 right-3">
              <div className="px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-sm">
                <span className="text-base font-semibold">{formatPrice(destination.price)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {destination.name}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-3.5 w-3.5 fill-chart-5 text-chart-5" />
                <span className="text-sm font-medium">{destination.rating}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
              {destination.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{destination.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{destination.distance}</span>
              </div>
              {destination.availability > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{destination.availability} vagas</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
