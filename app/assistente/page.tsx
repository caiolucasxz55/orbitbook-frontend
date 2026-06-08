"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Send,
  Sparkles,
  Rocket,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  MapPin,
  Users,
  Star,
  ExternalLink,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import { api, apiDestinoToDestination, ApiError, type ApiDestinoRecomendado } from "@/lib/api"
import type { ChatMessage } from "@/types"

const quickSuggestions = [
  "Qual é a melhor opção para iniciantes?",
  "Quero ver a Lua de perto",
  "Quanto custa um voo suborbital?",
  "Quais são os requisitos físicos?",
  "Me fale sobre a missão para Marte",
]

interface ChatMessageExtended extends ChatMessage {
  destinos_recomendados?: ApiDestinoRecomendado[]
}

const welcomeMessage: ChatMessageExtended = {
  id: "welcome",
  role: "assistant",
  content: `Olá! 👋 Sou ARIA, a assistente de IA do OrbitBook, especializada em ajudar você a encontrar a experiência espacial perfeita!

Posso ajudar com:
• Recomendações personalizadas de destinos
• Informações sobre requisitos e treinamento
• Detalhes técnicos das missões
• Comparação entre opções
• Processo de reserva e pagamento

O que você gostaria de saber sobre turismo espacial?`,
  timestamp: new Date().toISOString(),
  suggestions: ["Qual destino combina comigo?", "Opções para iniciantes", "Ver todos os destinos"],
}

function formatPrice(price: number) {
  if (price >= 1_000_000_000) return `$${(price / 1_000_000_000).toFixed(1)}B`
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(0)}M`
  return `$${(price / 1000).toFixed(0)}K`
}

const FALLBACK_IMAGE = "/destinations/aurora-orbital-hotel.jpg"

function RecommendationCard({ d }: { d: ApiDestinoRecomendado }) {
  const dest = apiDestinoToDestination({
    id: d.id,
    nome: d.nome,
    tipo: d.tipo,
    descricao: d.descricao,
    capacidade_max: d.capacidade_max,
    preco_base: d.preco_base,
    distance_km: d.distance_km,
    image_url: d.image_url,
    ativo: d.ativo,
    avaliacao: d.avaliacao,
  })
  const [imgSrc, setImgSrc] = useState(dest.heroImage || FALLBACK_IMAGE)

  return (
    <Link href={`/destino/${d.id}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/40 hover:bg-secondary/80 transition-all cursor-pointer group"
      >
        <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-card">
          <Image
            src={imgSrc}
            alt={d.nome}
            fill
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
              {d.nome}
            </h4>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{dest.tagline}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs font-bold text-primary">{formatPrice(d.preco_base)}</span>
            {d.distance_km && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {Number(d.distance_km).toLocaleString("pt-BR")} km
              </span>
            )}
            {d.capacidade_max && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {d.capacidade_max} pax
              </span>
            )}
            {d.avaliacao && d.avaliacao.total > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {d.avaliacao.media.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

function RecommendationCards({ destinos }: { destinos: ApiDestinoRecomendado[] }) {
  if (!destinos || destinos.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-3 grid gap-2"
    >
      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-primary" />
        Destinos recomendados:
      </p>
      {destinos.map((d) => (
        <RecommendationCard key={d.id} d={d} />
      ))}
    </motion.div>
  )
}

export default function AssistentePage() {
  const { openAuthModal } = useAuth()
  const [messages, setMessages] = useState<ChatMessageExtended[]>([welcomeMessage])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return

    const userMessage: ChatMessageExtended = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsTyping(true)

    try {
      const data = await api.ai.chat(
        updatedMessages.map((m) => ({ role: m.role, content: m.content }))
      )

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date().toISOString(),
          suggestions: data.suggestions,
          destinos_recomendados: data.destinos_recomendados,
        },
      ])
    } catch (error: unknown) {
      let errorMsg =
        "Desculpe, não foi possível conectar à API. Verifique se o servidor está rodando e tente novamente! 🚀"
      let suggestions = ["Tentar novamente", "Ver destinos disponíveis"]
      let triggerAuth = false

      if (error instanceof ApiError) {
        if (error.status === 401 || error.status === 403) {
          triggerAuth = true
          errorMsg =
            "Para conversar com a ARIA você precisa estar logado. Faça login ou crie sua conta! 🚀"
          suggestions = ["Criar conta", "Fazer login"]
        } else if (error.status === 502) {
          errorMsg =
            "A ARIA está temporariamente indisponível. O serviço de IA pode estar em manutenção. Tente novamente em breve! 🛸"
        } else if (error.status === 500) {
          errorMsg =
            "Erro interno no servidor. Verifique se o GEMINI_API_KEY está configurado corretamente no backend."
        }
      }

      if (triggerAuth) openAuthModal()

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: errorMsg,
          timestamp: new Date().toISOString(),
          suggestions,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const resetChat = () => {
    setMessages([{ ...welcomeMessage, timestamp: new Date().toISOString() }])
  }

  const renderMessageContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (!line.trim()) return null

      if (line.includes("**")) {
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        return (
          <p key={i} className="mb-2 last:mb-0">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : (
                part
              )
            )}
          </p>
        )
      }

      if (line.startsWith("•") || line.startsWith("-")) {
        return (
          <p key={i} className="mb-1 last:mb-0 ml-2">
            {line}
          </p>
        )
      }

      return (
        <p key={i} className="mb-2 last:mb-0">
          {line}
        </p>
      )
    })
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 pt-16 flex flex-col">
        <div className="mx-auto max-w-4xl w-full flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg shadow-primary/20">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">ARIA — Assistente OrbitBook</h1>
            <p className="text-muted-foreground">
              Tire suas dúvidas e encontre a experiência espacial perfeita
            </p>
          </motion.div>

          {/* Chat Area */}
          <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden border border-border/30">
            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4 sm:p-6">
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          message.role === "assistant"
                            ? "bg-gradient-to-br from-primary to-accent"
                            : "bg-secondary border border-border/50"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                        <div
                          className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-left ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-md"
                              : "bg-card/80 backdrop-blur-sm rounded-tl-md border border-border/30"
                          }`}
                        >
                          <div className="prose prose-sm prose-invert max-w-none text-sm">
                            {renderMessageContent(message.content)}
                          </div>
                        </div>

                        {/* Recommendation cards */}
                        {message.role === "assistant" &&
                          message.destinos_recomendados &&
                          message.destinos_recomendados.length > 0 && (
                            <div className="max-w-[85%]">
                              <RecommendationCards destinos={message.destinos_recomendados} />
                            </div>
                          )}

                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-2 mt-3"
                          >
                            {message.suggestions.map((suggestion) => (
                              <Button
                                key={suggestion}
                                variant="outline"
                                size="sm"
                                onClick={() => sendMessage(suggestion)}
                                className="text-xs border-border/50 hover:border-primary/40"
                                disabled={isTyping}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="bg-card/80 rounded-2xl rounded-tl-md px-4 py-3 border border-border/30">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Suggestions — só aparecem na tela inicial */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 sm:px-6 pb-4"
              >
                <p className="text-xs text-muted-foreground mb-3">Sugestões rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="secondary"
                      size="sm"
                      onClick={() => sendMessage(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="p-4 sm:p-6 border-t border-border/30">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-card/50 border-border/40 focus:border-primary/40"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" onClick={resetChat} disabled={isTyping} className="border-border/50">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground mb-3">
              Prefere explorar por conta própria?
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/explorar">
                <Button variant="outline" size="sm" className="gap-2 border-border/50">
                  <Rocket className="h-4 w-4" />
                  Ver Destinos
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2 border-border/50">
                  Minhas Reservas
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
