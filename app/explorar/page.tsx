"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, X, Grid3X3, List } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DestinationCard } from "@/components/destinations/destination-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { destinations, categories, priceRanges } from "@/data/destinations"
import { cn } from "@/lib/utils"

const riskLevels = ["Baixo", "Moderado", "Alto", "Extremo"]
const sortOptions = [
  { value: "popularity", label: "Popularidade" },
  { value: "price-asc", label: "Menor Preço" },
  { value: "price-desc", label: "Maior Preço" },
  { value: "rating", label: "Avaliação" },
  { value: "duration", label: "Duração" },
]

export default function ExplorarPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedRisks, setSelectedRisks] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all")
  const [sortBy, setSortBy] = useState("popularity")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filteredDestinations = useMemo(() => {
    let filtered = destinations.filter((destination) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !destination.name.toLowerCase().includes(query) &&
          !destination.description.toLowerCase().includes(query) &&
          !destination.tagline.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Category filter
      if (selectedCategory !== "all" && destination.category !== selectedCategory) {
        return false
      }

      // Risk filter
      if (selectedRisks.length > 0 && !selectedRisks.includes(destination.riskLevel)) {
        return false
      }

      // Price filter
      if (selectedPriceRange !== "all") {
        const range = priceRanges.find(r => r.id === selectedPriceRange)
        if (range && (destination.price < range.min || destination.price > range.max)) {
          return false
        }
      }

      return true
    })

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "duration":
        filtered.sort((a, b) => a.durationDays - b.durationDays)
        break
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedRisks, selectedPriceRange, sortBy])

  const activeFiltersCount = 
    (selectedCategory !== "all" ? 1 : 0) + 
    selectedRisks.length + 
    (selectedPriceRange !== "all" ? 1 : 0)

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedRisks([])
    setSelectedPriceRange("all")
    setSearchQuery("")
  }

  const toggleRisk = (risk: string) => {
    setSelectedRisks((prev) =>
      prev.includes(risk) ? prev.filter((r) => r !== risk) : [...prev, risk]
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Catálogo de Experiências
            </h1>
            <p className="text-muted-foreground">
              {destinations.length} experiências disponíveis em {categories.length - 1} categorias
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Search and Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>

            {/* Price Range Select */}
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger className="w-full sm:w-44 bg-card">
                <SelectValue placeholder="Preço" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.id} value={range.id}>
                    {range.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-44 bg-card">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* More Filters Button */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Mais Filtros</span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <SheetHeader>
                  <SheetTitle>Filtros Avançados</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Risk Level */}
                  <div>
                    <h3 className="font-medium mb-3">Nível de Risco</h3>
                    <div className="space-y-2">
                      {riskLevels.map((risk) => (
                        <div key={risk} className="flex items-center space-x-3">
                          <Checkbox
                            id={risk}
                            checked={selectedRisks.includes(risk)}
                            onCheckedChange={() => toggleRisk(risk)}
                          />
                          <Label htmlFor={risk} className="cursor-pointer text-sm">{risk}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Limpar Todos os Filtros
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {selectedCategory !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => setSelectedCategory("all")}
                >
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {selectedPriceRange !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => setSelectedPriceRange("all")}
                >
                  {priceRanges.find((r) => r.id === selectedPriceRange)?.name}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {selectedRisks.map((risk) => (
                <Badge
                  key={risk}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => toggleRisk(risk)}
                >
                  {risk}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              <button 
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Limpar todos
              </button>
            </motion.div>
          )}

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredDestinations.length} resultado{filteredDestinations.length !== 1 ? "s" : ""}
              {searchQuery && ` para "${searchQuery}"`}
            </p>
          </div>

          {/* Grid */}
          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <div className="text-4xl mb-4">🔭</div>
              <h3 className="text-lg font-semibold mb-2">Nenhum destino encontrado</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Tente ajustar seus filtros ou buscar por outro termo.
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
