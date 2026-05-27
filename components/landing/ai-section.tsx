"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Brain, MessageSquare, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Brain,
    title: "Recomendações Inteligentes",
    description: "Nossa IA analisa seu perfil, preferências e requisitos físicos para sugerir os destinos perfeitos para você.",
  },
  {
    icon: MessageSquare,
    title: "Assistente 24/7",
    description: "Tire dúvidas sobre requisitos, treinamento, segurança e prepare-se para sua viagem a qualquer momento.",
  },
  {
    icon: Zap,
    title: "Respostas Instantâneas",
    description: "Obtenha informações detalhadas sobre qualquer destino ou procedimento em segundos.",
  },
]

export function AISection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-4">
              <Sparkles className="h-4 w-4" />
              Tecnologia OrbitBook
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Seu assistente espacial
              <span className="text-gradient block">movido por IA</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Navegue pelo universo do turismo espacial com ajuda de inteligência artificial 
              avançada. Desde escolher seu destino até preparar-se para o lançamento, 
              nosso assistente está sempre pronto para ajudar.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/assistente">
              <Button size="lg" className="gap-2">
                Conversar com a IA
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass rounded-2xl p-6 gradient-border">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold">Orbit AI</h4>
                  <span className="text-xs text-muted-foreground">Online agora</span>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-end"
                >
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-2 max-w-[80%]">
                    <p className="text-sm">Qual é a melhor opção para quem nunca foi ao espaço?</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex"
                >
                  <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm leading-relaxed">
                      Para sua primeira experiência espacial, recomendo o <strong>Voo Suborbital Aurora</strong>! 
                      É perfeito para iniciantes: apenas 2 dias de treinamento, requisitos físicos acessíveis, 
                      e você experimentará 4 minutos de microgravidade com uma vista incrível da Terra. ✨
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap gap-2"
                >
                  {["Ver detalhes", "Requisitos", "Agendar"].map((label) => (
                    <Button key={label} variant="outline" size="sm" className="text-xs">
                      {label}
                    </Button>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-20 h-20 rounded-xl glass flex items-center justify-center"
            >
              <span className="text-3xl">🚀</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
