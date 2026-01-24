const footerLinks = {
  services: [
    { label: "Saveur Vanille", href: "#services" },
    { label: "Saveur Fraise", href: "#services" },
    { label: "Saveur Amande", href: "#services" },
  ],
  company: [
    { label: "Notre histoire", href: "#about" },
    { label: "Projets", href: "#work" },
    { label: "Carrieres", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "Dribbble", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Vimeo", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <a href="/" className="font-serif text-2xl text-background tracking-tight inline-block mb-4">
              choco<span className="text-accent">motion</span>
            </a>
            <p className="text-background/60 text-sm">
              Studio de motion design premium qui cree des animations fluides et 
              gourmandes donnant vie aux marques.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Nos Saveurs</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Suivez-nous</h4>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            © 2026 Chocomotion Studio. Tous droits reserves.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-background/40 hover:text-background transition-colors">
              Politique de confidentialite
            </a>
            <a href="#" className="text-sm text-background/40 hover:text-background transition-colors">
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
