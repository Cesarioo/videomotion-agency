"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Nouveaux projets disponibles pour T1 2026</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground leading-tight mb-6 text-balance">
          Le motion design
          <br />
          <span className="text-accent">fondant et savoureux</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 text-pretty">
          Nous creons des animations fluides et gourmandes qui captivent votre audience 
          et donnent vie a votre marque avec une saveur irresistible.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="gap-2 text-base">
            Voir nos projets
            <ArrowRight size={18} />
          </Button>
          <Button variant="outline" size="lg" className="gap-2 text-base bg-transparent">
            <Play size={18} />
            Regarder la bande-annonce
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Defiler</span>
          <div className="w-px h-12 bg-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-accent animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
