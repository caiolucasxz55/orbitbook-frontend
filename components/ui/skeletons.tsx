"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
}

export function DestinationCardSkeleton({ className }: SkeletonCardProps) {
  return (
    <div className={cn("glass rounded-2xl overflow-hidden", className)}>
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] bg-muted animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-5 w-12 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          <div className="h-4 w-18 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pt-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header skeleton */}
        <div className="space-y-4 mb-12">
          <div className="h-10 w-64 bg-muted rounded animate-pulse" />
          <div className="h-5 w-96 bg-muted rounded animate-pulse" />
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[80vh] bg-muted animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <div className="h-16 w-3/4 mx-auto bg-muted-foreground/10 rounded animate-pulse" />
          <div className="h-6 w-1/2 mx-auto bg-muted-foreground/10 rounded animate-pulse" />
          <div className="h-12 w-48 mx-auto bg-muted-foreground/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pt-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile header skeleton */}
        <div className="flex items-center gap-6 mb-12">
          <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
          <div className="space-y-3">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
        
        {/* Bookings skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          <div className="glass rounded-xl p-6 space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-20 w-32 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
