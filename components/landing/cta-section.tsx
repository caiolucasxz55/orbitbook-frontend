"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background" />
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[200px]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mb-8"
          >
            <Rocket className="h-10 w-10 text-primary-foreground" />
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Pronto para sua
            <span className="text-gradient block">aventura espacial?</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Junte-se a milhares de viajantes que já realizaram o sonho de ir ao espaço. 
            Sua próxima grande aventura está a um clique de distância.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/explorar">
              <Button size="lg" className="glow text-base px-8 h-14 gap-2">
                Começar Agora
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/assistente">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 h-14 gap-2"
              >
                Falar com Assistente IA
              </Button>
            </Link>
          </div>

          {/* Trust note */}
          <p className="mt-8 text-sm text-muted-foreground">
            Não é necessário compromisso. Explore destinos e converse com nossa IA gratuitamente.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
