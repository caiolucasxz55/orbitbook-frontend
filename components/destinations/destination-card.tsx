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
}

const badgeStyles: Record<BadgeType["type"], string> = {
  popular: "bg-primary/20 text-primary border-primary/30",
  new: "bg-accent/20 text-accent border-accent/30",
  lastSeats: "bg-destructive/20 text-destructive border-destructive/30",
  exclusive: "bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border-primary/30",
  promoted: "bg-chart-5/20 text-chart-5 border-chart-5/30",
}

export function DestinationCard({ destination, index = 0 }: DestinationCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    return `$${(price / 1000).toFixed(0)}K`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/destino/${destination.slug}`}>
        <div className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={destination.heroImage}
              alt={destination.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            
            {/* Badges */}
            {destination.badges.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                {destination.badges.slice(0, 2).map((badge) => (
                  <Badge
                    key={badge.type}
                    variant="outline"
                    className={cn("text-xs font-medium", badgeStyles[badge.type])}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="absolute bottom-3 right-3">
              <div className="glass-strong px-3 py-1.5 rounded-lg">
                <span className="text-lg font-bold">{formatPrice(destination.price)}</span>
                <span className="text-xs text-muted-foreground ml-1">USD</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {destination.name}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
                <span className="text-sm font-medium">{destination.rating}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {destination.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{destination.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{destination.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{destination.availability} vagas</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
