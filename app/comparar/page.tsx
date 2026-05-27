"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  Clock,
  MapPin,
  AlertTriangle,
  Check,
  X as XIcon,
  Plus,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { destinations } from "@/data/destinations"
import { cn } from "@/lib/utils"
import type { Destination } from "@/types"

const riskColors: Record<string, string> = {
  Baixo: "text-green-400",
  Moderado: "text-yellow-400",
  Alto: "text-orange-400",
  Extremo: "text-red-400",
}

export default function CompararPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    destinations[0]?.id || "",
    destinations[1]?.id || "",
  ])

  const selectedDestinations = selectedIds
    .map((id) => destinations.find((d) => d.id === id))
    .filter(Boolean) as Destination[]

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    return `$${(price / 1000).toFixed(0)}K`
  }

  const updateSelection = (index: number, value: string) => {
    const newIds = [...selectedIds]
    newIds[index] = value
    setSelectedIds(newIds)
  }

  const addColumn = () => {
    if (selectedIds.length < 4) {
      const availableDestination = destinations.find((d) => !selectedIds.includes(d.id))
      if (availableDestination) {
        setSelectedIds([...selectedIds, availableDestination.id])
      }
    }
  }

  const removeColumn = (index: number) => {
    if (selectedIds.length > 2) {
      setSelectedIds(selectedIds.filter((_, i) => i !== index))
    }
  }

  const comparisonFields = [
    { label: "Preço", getValue: (d: Destination) => formatPrice(d.price) },
    { label: "Duração", getValue: (d: Destination) => d.duration },
    { label: "Distância", getValue: (d: Destination) => d.distance },
    {
      label: "Risco",
      getValue: (d: Destination) => (
        <span className={riskColors[d.riskLevel]}>{d.riskLevel}</span>
      ),
    },
    {
      label: "Avaliação",
      getValue: (d: Destination) => (
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
          {d.rating}
        </span>
      ),
    },
    { label: "Avaliações", getValue: (d: Destination) => d.reviewCount },
    { label: "Vagas", getValue: (d: Destination) => `${d.availability}/${d.maxCapacity}` },
    { label: "Operadora", getValue: (d: Destination) => d.operator },
    { label: "Local de Lançamento", getValue: (d: Destination) => d.launchSite },
    { label: "Categoria", getValue: (d: Destination) => {
      const categoryNames: Record<string, string> = {
        suborbital: "Suborbital",
        leo: "Órbita Baixa",
        lunar: "Lunar",
        mars: "Marte",
      }
      return categoryNames[d.category] || d.category
    }},
  ]

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Comparar <span className="text-gradient">Destinos</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Compare lado a lado diferentes experiências espaciais e encontre a perfeita para você.
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-x-auto"
          >
            <div className="min-w-[800px]">
              {/* Header Row - Destination Cards */}
              <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)` }}>
                {/* Empty cell for labels column */}
                <div className="flex items-end">
                  {selectedIds.length < 4 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addColumn}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </Button>
                  )}
                </div>

                {/* Destination selectors */}
                {selectedIds.map((id, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Select value={id} onValueChange={(value) => updateSelection(index, value)}>
                        <SelectTrigger className="bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((d) => (
                            <SelectItem
                              key={d.id}
                              value={d.id}
                              disabled={selectedIds.includes(d.id) && d.id !== id}
                            >
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedIds.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeColumn(index)}
                          className="shrink-0"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Destination Card Preview */}
                    {selectedDestinations[index] && (
                      <div className="glass rounded-xl overflow-hidden">
                        <div className="relative aspect-video">
                          <Image
                            src={selectedDestinations[index].heroImage}
                            alt={selectedDestinations[index].name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="font-semibold text-sm truncate">
                              {selectedDestinations[index].name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Comparison Rows */}
              <div className="glass rounded-2xl overflow-hidden">
                {comparisonFields.map((field, fieldIndex) => (
                  <div
                    key={field.label}
                    className={cn(
                      "grid gap-4 py-4 px-6",
                      fieldIndex % 2 === 0 ? "bg-card/30" : "bg-transparent"
                    )}
                    style={{ gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)` }}
                  >
                    <div className="font-medium text-muted-foreground flex items-center">
                      {field.label}
                    </div>
                    {selectedDestinations.map((destination, index) => (
                      <div key={index} className="font-semibold flex items-center">
                        {destination ? field.getValue(destination) : "-"}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Highlights */}
                <div
                  className="grid gap-4 py-4 px-6 bg-card/30"
                  style={{ gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)` }}
                >
                  <div className="font-medium text-muted-foreground">Destaques</div>
                  {selectedDestinations.map((destination, index) => (
                    <div key={index} className="space-y-2">
                      {destination?.highlights.slice(0, 4).map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Requirements */}
                <div
                  className="grid gap-4 py-4 px-6"
                  style={{ gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)` }}
                >
                  <div className="font-medium text-muted-foreground">Requisitos</div>
                  {selectedDestinations.map((destination, index) => (
                    <div key={index} className="space-y-2">
                      {destination?.requirements.slice(0, 4).map((req, rIndex) => (
                        <div key={rIndex} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{req}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* CTA Row */}
                <div
                  className="grid gap-4 py-6 px-6 bg-card/50"
                  style={{ gridTemplateColumns: `200px repeat(${selectedIds.length}, 1fr)` }}
                >
                  <div />
                  {selectedDestinations.map((destination, index) => (
                    <div key={index}>
                      {destination && (
                        <Link href={`/destino/${destination.slug}`}>
                          <Button className="w-full">Ver Detalhes</Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
