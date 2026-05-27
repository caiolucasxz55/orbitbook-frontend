"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: "1",
    name: "Carlos Mendes",
    role: "CEO, TechVentures",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    rating: 5,
    content: "A experiência mais transformadora da minha vida. Ver a Terra do espaço mudou completamente minha perspectiva.",
  },
  {
    id: "2",
    name: "Ana Paula Silva",
    role: "Engenheira Aeroespacial",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    rating: 5,
    content: "O treinamento foi impecável e a equipe extremamente profissional. Vale cada centavo investido.",
  },
  {
    id: "3",
    name: "Ricardo Oliveira",
    role: "Investidor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    rating: 5,
    content: "5 dias na estação orbital foram os mais incríveis da minha vida. A vista da cúpola é surreal.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            O que nossos viajantes dizem
          </h2>
          <p className="text-muted-foreground">
            Histórias reais de quem já viveu essa experiência.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-5 right-5 h-6 w-6 text-muted-foreground/20" />

              {/* Rating */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-chart-5 text-chart-5" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center bg-muted"
                  style={{ backgroundImage: `url(${testimonial.avatar})` }}
                />
                <div>
                  <div className="font-medium text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
