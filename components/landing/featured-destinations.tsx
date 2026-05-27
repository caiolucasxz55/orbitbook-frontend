"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DestinationCard } from "@/components/destinations/destination-card"
import { destinations } from "@/data/destinations"

export function FeaturedDestinations() {
  const featuredDestinations = destinations.filter((d) => d.featured).slice(0, 8)

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Destinos em Destaque
            </h2>
            <p className="text-muted-foreground">
              As experiências mais populares e exclusivas do nosso catálogo.
            </p>
          </div>
          <Link href="/explorar">
            <Button variant="outline" size="sm" className="gap-2">
              Ver Todos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredDestinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
