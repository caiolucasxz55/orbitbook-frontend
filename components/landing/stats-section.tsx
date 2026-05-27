"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

const stats = [
  { value: "2.847", label: "Viajantes Espaciais" },
  { value: "15", label: "Destinos Disponíveis" },
  { value: "99.8%", label: "Taxa de Segurança" },
  { value: "7", label: "Operadores Parceiros" },
]

function AnimatedCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""))
  const hasDecimal = value.includes(".")
  const prefix = value.match(/^[^0-9]*/)?.[0] || ""
  const suffix = value.match(/[^0-9.]*$/)?.[0] || ""

  useEffect(() => {
    if (isInView) {
      const duration = 1500
      const steps = 40
      const increment = numericValue / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setCount(numericValue)
          clearInterval(timer)
        } else {
          setCount(current)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, numericValue])

  return (
    <span ref={ref}>
      {prefix}
      {hasDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString("pt-BR")}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-16 border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
