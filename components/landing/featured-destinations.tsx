"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DestinationCard } from "@/components/destinations/destination-card"
import { api, apiDestinoToDestination } from "@/lib/api"
import type { Destination } from "@/types"

export function FeaturedDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])

  useEffect(() => {
    api.destinos
      .list()
      .then((dests) => {
        const converted = dests.map(apiDestinoToDestination)
        // Show featured first, then fill up to 8 with highest-rated
        const featured = converted.filter((d) => d.featured)
        const rest = converted
          .filter((d) => !d.featured)
          .sort((a, b) => b.rating - a.rating)
        setDestinations([...featured, ...rest].slice(0, 8))
      })
      .catch(() => {})
  }, [])

  if (destinations.length === 0) return null

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-sm text-primary font-medium mb-2 tracking-wide uppercase">
              Destaques
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Destinos em Destaque
            </h2>
            <p className="text-muted-foreground">
              As experiências mais populares e exclusivas do nosso catálogo.
            </p>
          </div>
          <Link href="/explorar">
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              Ver Todos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((destination, index) => (
            <DestinationCard key={destination.id} destination={destination} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
