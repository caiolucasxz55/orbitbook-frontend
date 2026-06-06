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
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import type { ChatMessage } from "@/types"

const quickSuggestions = [
  "Qual é a melhor opção para iniciantes?",
  "Quero ver a Lua de perto",
  "Quanto custa um voo suborbital?",
  "Quais são os requisitos físicos?",
  "Me fale sobre a missão para Marte",
]

const welcomeMessage: ChatMessage = {
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

export default function AssistentePage() {
  const { openAuthModal } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
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

    const userMessage: ChatMessage = {
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
        },
      ])
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : ""
      const isAuthError =
        msg.includes("401") ||
        msg.toLowerCase().includes("token") ||
        msg.toLowerCase().includes("authenticated")

      if (isAuthError) {
        openAuthModal()
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content:
              "Para conversar com a ARIA você precisa estar logado. Faça login ou crie sua conta! 🚀",
            timestamp: new Date().toISOString(),
            suggestions: ["Criar conta", "Fazer login"],
          },
        ])
      } else {
        console.error("Chat error:", error)
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content:
              "Desculpe, tive um problema de conexão. Verifique sua conexão e tente novamente! 🚀",
            timestamp: new Date().toISOString(),
            suggestions: ["Tentar novamente", "Ver destinos disponíveis", "Quais são os requisitos?"],
          },
        ])
      }
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const resetChat = () => {
    setMessages([{ ...welcomeMessage, timestamp: new Date().toISOString() }])
  }

  // Renderiza o conteúdo da mensagem respeitando markdown simples
  const renderMessageContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (!line.trim()) return null

      // Linha com **negrito**
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

      // Bullet point
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">ARIA — Assistente OrbitBook</h1>
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
                      <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                        <div
                          className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-left ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-md"
                              : "bg-card rounded-tl-md"
                          }`}
                        >
                          <div className="prose prose-sm prose-invert max-w-none">
                            {renderMessageContent(message.content)}
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
                    <div className="bg-card rounded-2xl rounded-tl-md px-4 py-3">
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
                <Button type="button" variant="outline" onClick={resetChat} disabled={isTyping}>
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