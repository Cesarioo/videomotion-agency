"use client"

import { useState } from "react"

const projects = [
  {
    id: 1,
    title: "Reves de Cacao",
    category: "Animation de marque",
    description: "Un film de marque luxueux pour un maitre chocolatier artisanal",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: 2,
    title: "Fondre & Couler",
    category: "Lancement produit",
    description: "Motion graphics dynamiques pour une collection de truffes premium",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: 3,
    title: "Symphonie Sucree",
    category: "Campagne sociale",
    description: "Contenu anime social qui a genere plus de 2M d'impressions",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: 4,
    title: "Tourbillon Dore",
    category: "Spot publicitaire",
    description: "Spot de 30 secondes prime pour la saison des fetes",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
]

export function WorkSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="work" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="text-sm text-accent uppercase tracking-widest mb-4 block">
              Projets Selectionnes
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground text-balance">
              Concus avec passion,
              <br />
              livres avec saveur
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <video
                src={project.video}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay={hoveredId === project.id}
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause()
                  e.currentTarget.currentTime = 0
                }}
              />

              {/* Project info overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent">
                <span className="text-xs text-primary-foreground/70 uppercase tracking-widest mb-2">
                  {project.category}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-primary-foreground mb-2">
                  {project.title}
                </h3>
                <p
                  className={`text-sm text-primary-foreground/80 transition-all duration-300 ${
                    hoveredId === project.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
                >
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
