"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Send,
  Sparkles,
  Rocket,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { destinations } from "@/data/destinations"
import type { ChatMessage } from "@/types"

const quickSuggestions = [
  "Qual é a melhor opção para iniciantes?",
  "Quero ver a Lua de perto",
  "Quanto custa um voo suborbital?",
  "Quais são os requisitos físicos?",
  "Me fale sobre a missão para Marte",
]

const aiResponses: Record<string, { content: string; suggestions?: string[] }> = {
  iniciantes: {
    content: `Para sua primeira experiência espacial, recomendo o **Voo Suborbital Aurora**! 🚀

É perfeito para iniciantes porque:
• Apenas 2 dias de treinamento
• Requisitos físicos acessíveis
• 4 minutos de microgravidade
• Vista incrível da curvatura da Terra
• Preço a partir de $450.000

O treinamento é completo e a equipe da Stellar Dynamics é reconhecida pela excelência no atendimento a viajantes de primeira viagem.`,
    suggestions: ["Ver detalhes do voo", "Quais são os requisitos?", "Posso parcelar?"],
  },
  lua: {
    content: `Para ver a Lua de perto, temos o **Circuito Lunar Artemis**! 🌙

Esta é a experiência mais exclusiva que oferecemos:
• 8 dias de missão
• Passagem a apenas 100km da superfície lunar
• Vista do lado oculto da Lua
• Máximo 3 passageiros por viagem
• Inclui chef pessoal e médico a bordo

O investimento é de $75 milhões, mas a experiência é verdadeiramente única na vida - você estará mais longe da Terra do que qualquer turista já esteve!`,
    suggestions: ["Ver calendário de missões", "Quais os requisitos?", "Formas de pagamento"],
  },
  suborbital: {
    content: `Os voos suborbitais são nossa opção mais acessível! 💫

Temos duas opções disponíveis:

**1. Voo Suborbital Aurora** - $450.000
• 90 minutos de experiência
• 4 minutos em microgravidade
• Próxima data: 15 de julho de 2026

**2. Eclipse Solar Orbital** - $650.000
• Voo especial durante eclipse solar
• 6 minutos de eclipse visto do espaço
• Próxima data: 12 de agosto de 2027

Ambos incluem treinamento completo, certificado de astronauta e hospedagem no spaceport!`,
    suggestions: ["Comparar as duas opções", "Como funciona o treinamento?", "Quero reservar"],
  },
  requisitos: {
    content: `Os requisitos variam por tipo de missão. Aqui estão os básicos:

**Voos Suborbitais:**
• Idade: 18+ anos
• Altura: 1.52m - 1.93m
• Peso: até 100kg
• Atestado médico aprovado
• 2 dias de treinamento

**Estação Orbital (LEO):**
• Idade: 21+ anos
• Excelente condição física
• 14 dias de treinamento intensivo

**Missões Lunares/Marte:**
• Avaliação médica e psicológica rigorosa
• 30 dias a 1 ano de treinamento
• Experiência prévia recomendada

Quer saber os requisitos específicos de algum destino?`,
    suggestions: ["Requisitos do voo suborbital", "Posso fazer se tenho problema cardíaco?", "Como é o treinamento?"],
  },
  marte: {
    content: `A **Expedição Marte Pioneer** é a missão mais ambiciosa da história do turismo espacial! 🔴

Esta não é apenas uma viagem - é uma oportunidade de fazer história:
• Duração: 2 anos completos
• Equipe de 12 pioneiros
• Construção da base Mars Alpha
• Exploração da superfície marciana
• Pesquisas científicas históricas

**Investimento:** $250 milhões

**Requisitos especiais:**
• Idade: 25-50 anos
• Habilidades técnicas específicas
• 1 ano de treinamento
• Compromisso mínimo de 2 anos

Próxima janela de lançamento: Novembro de 2028`,
    suggestions: ["Quem pode se candidatar?", "Como funciona a seleção?", "Benefícios para pioneiros"],
  },
  default: {
    content: `Olá! 👋 Sou o assistente de IA do OrbitBook, especializado em ajudar você a encontrar a experiência espacial perfeita!

Posso ajudar com:
• Recomendações personalizadas de destinos
• Informações sobre requisitos e treinamento
• Detalhes técnicos das missões
• Comparação entre opções
• Processo de reserva e pagamento

O que você gostaria de saber sobre turismo espacial?`,
    suggestions: ["Qual destino combina comigo?", "Opções para iniciantes", "Ver todos os destinos"],
  },
}

function getAIResponse(message: string): { content: string; suggestions?: string[] } {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes("iniciante") || lowerMessage.includes("primeira vez") || lowerMessage.includes("nunca foi")) {
    return aiResponses.iniciantes
  }
  if (lowerMessage.includes("lua") || lowerMessage.includes("lunar")) {
    return aiResponses.lua
  }
  if (lowerMessage.includes("suborbital") || lowerMessage.includes("quanto custa") || lowerMessage.includes("preço")) {
    return aiResponses.suborbital
  }
  if (lowerMessage.includes("requisito") || lowerMessage.includes("físico") || lowerMessage.includes("preciso")) {
    return aiResponses.requisitos
  }
  if (lowerMessage.includes("marte") || lowerMessage.includes("mars")) {
    return aiResponses.marte
  }
  
  return aiResponses.default
}

export default function AssistentePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: aiResponses.default.content,
      timestamp: new Date().toISOString(),
      suggestions: aiResponses.default.suggestions,
    },
  ])
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
    if (!content.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Get AI response
    const response = getAIResponse(content)
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: response.content,
      timestamp: new Date().toISOString(),
      suggestions: response.suggestions,
    }
    setMessages((prev) => [...prev, aiMessage])
    setIsTyping(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: aiResponses.default.content,
        timestamp: new Date().toISOString(),
        suggestions: aiResponses.default.suggestions,
      },
    ])
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Assistente OrbitBook</h1>
            <p className="text-muted-foreground">
              Tire suas dúvidas e encontre a experiência espacial perfeita
            </p>
          </motion.div>

          {/* Chat Area */}
          <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden">
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
                            : "bg-secondary"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}
                      >
                        <div
                          className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-left ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-md"
                              : "bg-card rounded-tl-md"
                          }`}
                        >
                          <div className="prose prose-sm prose-invert max-w-none">
                            {message.content.split("\n").map((line, i) => (
                              <p key={i} className="mb-2 last:mb-0">
                                {line.startsWith("**") ? (
                                  <strong>{line.replace(/\*\*/g, "")}</strong>
                                ) : line.startsWith("•") ? (
                                  <span className="block ml-2">{line}</span>
                                ) : (
                                  line
                                )}
                              </p>
                            ))}
                          </div>
                        </div>

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
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs"
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
                    <div className="bg-card rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Suggestions (shown when chat is fresh) */}
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
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="p-4 sm:p-6 border-t border-border/50">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-card"
                  disabled={isTyping}
                />
                <Button type="submit" disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" onClick={resetChat}>
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
                <Button variant="outline" size="sm" className="gap-2">
                  <Rocket className="h-4 w-4" />
                  Ver Destinos
                </Button>
              </Link>
              <Link href="/comparar">
                <Button variant="outline" size="sm" className="gap-2">
                  Comparar Opções
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
