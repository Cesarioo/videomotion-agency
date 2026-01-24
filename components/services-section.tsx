import Image from "next/image"

const services = [
  {
    id: 1,
    title: "Saveur Vanille",
    price: "A partir de 2 500 EUR",
    description:
      "Notre formule essentielle. Parfaite pour les startups et petites entreprises qui souhaitent une animation de marque elegante et memorable. Inclut concept, storyboard et livraison HD.",
    image: "/services/vanilla.jpg",
  },
  {
    id: 2,
    title: "Saveur Fraise",
    price: "A partir de 5 000 EUR",
    description:
      "Notre offre la plus populaire. Ideal pour les campagnes marketing et lancements de produits. Inclut motion graphics avances, musique originale et declinaisons multi-formats.",
    image: "/services/strawberry.jpg",
  },
  {
    id: 3,
    title: "Saveur Amande",
    price: "A partir de 12 000 EUR",
    description:
      "L'experience premium complete. Pour les marques exigeantes qui veulent des creations exceptionnelles. Inclut animation 3D, direction artistique complete et accompagnement strategique.",
    image: "/services/almond.jpg",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-sm text-accent uppercase tracking-widest mb-4 block">
            Nos Services
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6 text-balance">
            Chaque saveur du motion,
            <br />
            preparee avec expertise
          </h2>
          <p className="text-muted-foreground">
            Du concept a la livraison finale, nous traitons chaque projet avec le meme soin 
            qu'un maitre chocolatier apporte a ses plus belles creations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-accent transition-colors"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-accent font-medium mb-4">{service.price}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
