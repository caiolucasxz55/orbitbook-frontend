"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, X } from "lucide-react"
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
import { destinations, categories } from "@/data/destinations"
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRisks, setSelectedRisks] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000000])
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
      if (selectedCategories.length > 0 && !selectedCategories.includes(destination.category)) {
        return false
      }

      // Risk filter
      if (selectedRisks.length > 0 && !selectedRisks.includes(destination.riskLevel)) {
        return false
      }

      // Price filter
      if (destination.price < priceRange[0] || destination.price > priceRange[1]) {
        return false
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
  }, [searchQuery, selectedCategories, selectedRisks, priceRange, sortBy])

  const activeFiltersCount = selectedCategories.length + selectedRisks.length + (priceRange[0] > 0 || priceRange[1] < 300000000 ? 1 : 0)

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedRisks([])
    setPriceRange([0, 300000000])
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const toggleRisk = (risk: string) => {
    setSelectedRisks((prev) =>
      prev.includes(risk) ? prev.filter((r) => r !== risk) : [...prev, risk]
    )
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(0)}M`
    }
    return `$${(price / 1000).toFixed(0)}K`
  }

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-4">Categoria</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={category.id} className="flex-1 cursor-pointer">
                <span className="block font-medium">{category.name}</span>
                <span className="block text-xs text-muted-foreground">{category.description}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-4">Faixa de Preço</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={300000000}
            step={100000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Risk Level */}
      <div>
        <h3 className="font-semibold mb-4">Nível de Risco</h3>
        <div className="space-y-3">
          {riskLevels.map((risk) => (
            <div key={risk} className="flex items-center space-x-3">
              <Checkbox
                id={risk}
                checked={selectedRisks.includes(risk)}
                onCheckedChange={() => toggleRisk(risk)}
              />
              <Label htmlFor={risk} className="cursor-pointer">{risk}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Limpar Filtros
        </Button>
      )}
    </div>
  )

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
              Explorar <span className="text-gradient">Destinos</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Descubra experiências espaciais únicas, desde voos suborbitais de minutos 
              até expedições interplanetárias de anos.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar destinos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 bg-card">
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

            {/* Mobile Filter Button */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {selectedCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => toggleCategory(cat)}
                >
                  {categories.find((c) => c.id === cat)?.name}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {selectedRisks.map((risk) => (
                <Badge
                  key={risk}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => toggleRisk(risk)}
                >
                  Risco: {risk}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 300000000) && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => setPriceRange([0, 300000000])}
                >
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </motion.div>
          )}

          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block w-72 shrink-0"
            >
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h2 className="font-semibold text-lg mb-6">Filtros</h2>
                <FilterContent />
              </div>
            </motion.aside>

            {/* Results */}
            <div className="flex-1">
              {/* Results count */}
              <div className="mb-6 text-sm text-muted-foreground">
                {filteredDestinations.length} destino{filteredDestinations.length !== 1 ? "s" : ""} encontrado{filteredDestinations.length !== 1 ? "s" : ""}
              </div>

              {/* Grid */}
              {filteredDestinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDestinations.map((destination, index) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔭</div>
                  <h3 className="text-xl font-semibold mb-2">Nenhum destino encontrado</h3>
                  <p className="text-muted-foreground mb-6">
                    Tente ajustar seus filtros ou buscar por outro termo.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
