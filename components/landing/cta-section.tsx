"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Pronto para sua aventura espacial?
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Explore nosso catálogo completo e encontre a experiência perfeita para você. 
            Sem compromisso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/explorar">
              <Button size="lg" className="gap-2 h-11 px-6">
                Ver Catálogo Completo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/assistente">
              <Button variant="outline" size="lg" className="h-11 px-6">
                Falar com Especialista
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
