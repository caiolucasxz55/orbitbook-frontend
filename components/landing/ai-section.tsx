"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, MessageSquare, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Sparkles,
    title: "Recomendações Personalizadas",
    description: "Análise de perfil e preferências para sugerir os destinos ideais.",
  },
  {
    icon: MessageSquare,
    title: "Assistente 24/7",
    description: "Tire dúvidas sobre requisitos, treinamento e segurança.",
  },
  {
    icon: Zap,
    title: "Respostas Instantâneas",
    description: "Informações detalhadas sobre qualquer destino em segundos.",
  },
]

export function AISection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-medium text-primary mb-3 block">
              Assistente Virtual
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Planeje sua viagem com ajuda de IA
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Nosso assistente inteligente ajuda você a escolher o destino ideal, 
              entender os requisitos e se preparar para sua aventura espacial.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-0.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/assistente">
              <Button className="gap-2">
                Conversar com a IA
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Chat Preview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Orbit AI</h4>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-sm px-3.5 py-2 max-w-[85%]">
                    <p className="text-sm">Qual a melhor opção para iniciantes?</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="bg-secondary rounded-xl rounded-tl-sm px-3.5 py-2.5 max-w-[90%]">
                    <p className="text-sm leading-relaxed">
                      Para iniciantes, recomendo o <strong>Voo Suborbital Aurora</strong>. 
                      Apenas 2 dias de treinamento, requisitos acessíveis e 4 minutos de 
                      microgravidade com vista incrível da Terra.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {["Ver detalhes", "Requisitos"].map((label) => (
                    <Button key={label} variant="outline" size="sm" className="text-xs h-7">
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
