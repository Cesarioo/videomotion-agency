const clients = [
  "Godiva",
  "Lindt",
  "Ghirardelli",
  "Ferrero",
  "Toblerone",
  "Cadbury",
  "Hershey's",
]

export function ClientsSection() {
  return (
    <section className="py-16 border-y border-border bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Les plus grandes marques nous font confiance pour creer la magie du mouvement
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {clients.map((client) => (
            <span
              key={client}
              className="text-lg md:text-xl font-medium text-muted-foreground/60 hover:text-foreground transition-colors cursor-default"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
