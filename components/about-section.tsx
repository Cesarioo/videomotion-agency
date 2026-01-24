import Image from "next/image"

const galleryImages = [
  { src: "/about/studio-1.jpg", alt: "Notre studio de creation", size: "large" },
  { src: "/about/team-1.jpg", alt: "Notre equipe au travail", size: "small" },
  { src: "/about/process-1.jpg", alt: "Processus creatif", size: "medium" },
  { src: "/about/workspace-1.jpg", alt: "Espace de travail", size: "small" },
  { src: "/about/studio-2.jpg", alt: "Studio d'animation", size: "medium" },
  { src: "/about/team-2.jpg", alt: "Reunion creative", size: "large" },
  { src: "/about/process-2.jpg", alt: "Storyboarding", size: "small" },
  { src: "/about/workspace-2.jpg", alt: "Poste de montage", size: "medium" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-sm text-accent uppercase tracking-widest mb-4 block">
            Notre Histoire
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6 text-balance">
            La ou le mouvement
            <br />
            rencontre la passion
          </h2>
          <p className="text-muted-foreground mb-4">
            Chocomotion est ne d'une conviction simple : le motion design doit etre aussi 
            satisfaisant qu'une bouchee de chocolat parfaitement elabore. Riche, onctueux, 
            et impossible a oublier.
          </p>
          <p className="text-muted-foreground">
            Notre equipe d'animateurs, designers et conteurs rassemble des decennies 
            d'experience combinee dans la marque, le broadcast et le digital. Nous obsedons 
            sur chaque image, chaque transition, chaque detail — car c'est ce qui separe 
            le bon de l'inoubliable.
          </p>
        </div>

        {/* Image Gallery - 2 rows with varying sizes */}
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="flex gap-4 overflow-hidden">
            <div className="flex-shrink-0 w-[400px] h-64 relative rounded-xl overflow-hidden bg-secondary">
              <Image
                src={galleryImages[0].src || "/placeholder.svg"}
                alt={galleryImages[0].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-[250px] h-64 relative rounded-xl overflow-hidden bg-secondary">
              <Image
                src={galleryImages[1].src || "/placeholder.svg"}
                alt={galleryImages[1].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-[320px] h-64 relative rounded-xl overflow-hidden bg-secondary">
              <Image
                src={galleryImages[2].src || "/placeholder.svg"}
                alt={galleryImages[2].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-[200px] h-64 relative rounded-xl overflow-hidden bg-secondary">
              <Image
                src={galleryImages[3].src || "/placeholder.svg"}
                alt={galleryImages[3].alt}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex gap-4 overflow-hidden">
            <div className="flex-shrink-0 w-[280px] h-64 relative rounded-xl overflow-hidden bg-secondary">
              <Image
                src={galleryImages[4].src || "/placeholder.svg"}
                alt={galleryImages[4].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-[380px] h-64 relative rounded-xl overflow-hidden bg-secondary">
              <Image
                src={galleryImages[5].src || "/placeholder.svg"}
                alt={galleryImages[5].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-[220px] h-64 relative rounded-xl overflow-hidden bg-secondary">
              <Image
                src={galleryImages[6].src || "/placeholder.svg"}
                alt={galleryImages[6].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-[350px] h-64 relative rounded-xl overflow-hidden bg-secondary">
              <Image
                src={galleryImages[7].src || "/placeholder.svg"}
                alt={galleryImages[7].alt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
