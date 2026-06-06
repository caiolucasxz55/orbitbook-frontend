"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  SlidersHorizontal,
  X,
  Rocket,
  Globe,
  Moon,
  Star,
  Telescope,
  Zap,
  ChevronDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { api, apiDestinoToDestination } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { Destination } from "@/types"

const categories = [
  { id: "all", name: "Todos", icon: Telescope },
  { id: "suborbital", name: "Suborbital", icon: Zap },
  { id: "leo", name: "Órbita Terrestre", icon: Globe },
  { id: "lunar", name: "Lunar", icon: Moon },
  { id: "mars", name: "Marte", icon: Rocket },
  { id: "deepspace", name: "Espaço Profundo", icon: Star },
]

const priceRanges = [
  { id: "all", label: "Todos os preços", min: 0, max: Infinity },
  { id: "entry", label: "Até $1M", min: 0, max: 1_000_000 },
  { id: "mid", label: "$1M – $50M", min: 1_000_000, max: 50_000_000 },
  { id: "high", label: "$50M – $200M", min: 50_000_000, max: 200_000_000 },
  { id: "ultra", label: "Acima de $200M", min: 200_000_000, max: Infinity },
]

const sortOptions = [
  { value: "popularity", label: "Mais Populares" },
  { value: "price-asc", label: "Menor Preço" },
  { value: "price-desc", label: "Maior Preço" },
  { value: "rating", label: "Melhor Avaliados" },
  { value: "capacity-asc", label: "Menor Capacidade" },
]

export default function ExplorarPage() {
  const [allDestinations, setAllDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("popularity")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    api.destinos
      .list()
      .then((dests) => setAllDestinations(dests.map(apiDestinoToDestination)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allDestinations.length }
    for (const d of allDestinations) {
      counts[d.category] = (counts[d.category] ?? 0) + 1
    }
    return counts
  }, [allDestinations])

  const filteredDestinations = useMemo(() => {
    let filtered = allDestinations.filter((d) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !d.name.toLowerCase().includes(q) &&
          !d.description.toLowerCase().includes(q) &&
          !d.tagline.toLowerCase().includes(q)
        )
          return false
      }
      if (selectedCategory !== "all" && d.category !== selectedCategory) return false
      if (selectedPriceRange !== "all") {
        const range = priceRanges.find((r) => r.id === selectedPriceRange)
        if (range && (d.price < range.min || d.price > range.max)) return false
      }
      return true
    })

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
      case "capacity-asc":
        filtered.sort((a, b) => a.maxCapacity - b.maxCapacity)
        break
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    return filtered
  }, [allDestinations, searchQuery, selectedCategory, selectedPriceRange, sortBy])

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) + (selectedPriceRange !== "all" ? 1 : 0)

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedPriceRange("all")
    setSearchQuery("")
  }

  const skeletonCount = viewMode === "grid" ? 8 : 6

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="pt-24 pb-10 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
          >
            <div>
              <p className="text-sm text-primary font-medium mb-2 tracking-wide uppercase">
                Catálogo
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Experiências Espaciais
              </h1>
              <p className="text-muted-foreground">
                {loading
                  ? "Carregando destinos..."
                  : `${allDestinations.length} experiências disponíveis para reserva`}
              </p>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          >
            {categories.map((cat) => {
              const Icon = cat.icon
              const count = categoryCounts[cat.id] ?? 0
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                      : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {cat.name}
                  {count > 0 && cat.id !== "all" && (
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                        isActive ? "bg-white/20" : "bg-secondary"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </motion.div>
        </div>
      </section>

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card h-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Price Range */}
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger className="w-full sm:w-44 bg-card h-10 gap-1">
                <SelectValue placeholder="Preço" />
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 bg-card h-10 gap-1">
                <SelectValue placeholder="Ordenar" />
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filters sheet */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 relative">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtros</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="font-medium text-sm mb-3">Faixa de Preço</h3>
                    <div className="space-y-1">
                      {priceRanges.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            setSelectedPriceRange(r.id)
                            setFiltersOpen(false)
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                            selectedPriceRange === r.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {r.label}
                          {selectedPriceRange === r.id && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-sm mb-3">Categoria</h3>
                    <div className="space-y-1">
                      {categories.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id)
                              setFiltersOpen(false)
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                              selectedCategory === cat.id
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {cat.name}
                            {selectedCategory === cat.id && (
                              <div className="w-2 h-2 rounded-full bg-primary ml-auto" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {activeFiltersCount > 0 && (
                    <>
                      <Separator />
                      <Button variant="outline" onClick={clearFilters} className="w-full">
                        Limpar todos os filtros
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* View mode toggle */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-border p-1 bg-card">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Active filter chips */}
          <AnimatePresence>
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center gap-2 mb-5"
              >
                <span className="text-xs text-muted-foreground">Ativos:</span>
                {selectedCategory !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer text-xs hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setSelectedCategory("all")}
                  >
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {selectedPriceRange !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer text-xs hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setSelectedPriceRange("all")}
                  >
                    {priceRanges.find((r) => r.id === selectedPriceRange)?.label}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Limpar todos
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <span className="inline-block w-36 h-4 bg-secondary rounded animate-pulse" />
              ) : (
                <>
                  <span className="font-semibold text-foreground">{filteredDestinations.length}</span>{" "}
                  resultado{filteredDestinations.length !== 1 ? "s" : ""}
                  {searchQuery && (
                    <span>
                      {" "}para{" "}
                      <span className="text-primary font-medium">&quot;{searchQuery}&quot;</span>
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Grid / List */}
          {loading ? (
            <div
              className={cn(
                "grid gap-5",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2"
              )}
            >
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl border border-border animate-pulse"
                  style={{ height: viewMode === "grid" ? 280 : 200 }}
                />
              ))}
            </div>
          ) : filteredDestinations.length > 0 ? (
            <motion.div
              layout
              className={cn(
                "grid gap-5",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2"
              )}
            >
              <AnimatePresence mode="popLayout">
                {filteredDestinations.map((destination, index) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    index={index}
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-card rounded-2xl border border-border"
            >
              <div className="text-5xl mb-4">🔭</div>
              <h3 className="text-lg font-semibold mb-2">Nenhum destino encontrado</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                Tente ajustar os filtros ou buscar por outro termo.
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
