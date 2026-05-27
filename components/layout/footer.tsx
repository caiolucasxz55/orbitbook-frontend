import Link from "next/link"
import { Rocket, Twitter, Instagram, Youtube, Linkedin } from "lucide-react"

const footerLinks = {
  destinos: [
    { label: "Voos Suborbitais", href: "/explorar?category=suborbital" },
    { label: "Órbita Baixa (LEO)", href: "/explorar?category=leo" },
    { label: "Missões Lunares", href: "/explorar?category=lunar" },
    { label: "Colonização Marte", href: "/explorar?category=mars" },
  ],
  empresa: [
    { label: "Sobre Nós", href: "/sobre" },
    { label: "Carreiras", href: "/carreiras" },
    { label: "Imprensa", href: "/imprensa" },
    { label: "Parceiros", href: "/parceiros" },
  ],
  suporte: [
    { label: "Central de Ajuda", href: "/ajuda" },
    { label: "Requisitos Médicos", href: "/requisitos" },
    { label: "Treinamento", href: "/treinamento" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Termos de Uso", href: "/termos" },
    { label: "Privacidade", href: "/privacidade" },
    { label: "Cookies", href: "/cookies" },
    { label: "Licenças", href: "/licencas" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">
                Orbit<span className="text-primary">Book</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Sua porta de entrada para o turismo espacial. Reserve experiências únicas além da atmosfera.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Destinos</h3>
            <ul className="space-y-3">
              {footerLinks.destinos.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 OrbitBook. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Licenciado pela FAA • Certificado ISO 9001 • Membro da Space Tourism Society
          </p>
        </div>
      </div>
    </footer>
  )
}
