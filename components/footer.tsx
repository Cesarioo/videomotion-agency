const footerLinks = {
  services: [
    { label: "Vanilla Flavor", href: "#services" },
    { label: "Rasberry Flavor", href: "#services" },
    { label: "Caramel Flavor", href: "#services" },
  ],
  company: [
    { label: "Our Story", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Careers", href: "#" },
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
            <a href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="Chocomotion"
                className="h-8 w-8"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="font-serif text-2xl text-background tracking-tight">
                choco<span className="text-accent">motion</span>
              </span>
            </a>
            <p className="text-background/60 text-sm">
              Premium motion design studio crafting irresistibly smooth animations 
              that bring brands to life.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Our Flavors</h4>
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
            <h4 className="font-medium text-background mb-4">Company</h4>
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
            <h4 className="font-medium text-background mb-4">Follow Us</h4>
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
            © 2026 Chocomotion Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-background/40 hover:text-background transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-background/40 hover:text-background transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
