import Link from 'next/link';
import { FiTwitter as Twitter, FiLinkedin as Linkedin } from 'react-icons/fi';

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border mt-auto relative z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12 md:pb-16">

        <div className="flex flex-col md:flex-row justify-between gap-8 lg:gap-12 mb-12">
          {/* Col 1: Brand & Desc */}
          <div className="flex-1 max-w-lg">
            <img src="/logo.svg?v=10" alt="PropertyFinder" className="h-14 md:h-16 w-auto mb-6" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              Encuentra el hogar que prefieras. Conectamos la mejor tecnología de búsqueda con las propiedades más destacadas del mercado inmobiliario chileno.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://pruff.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/pruff/?originalSubdomain=cl" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Links */}
          <div className="pt-[30px]">
            <h3 className="font-semibold text-foreground mb-4">Descubrir</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Buscar Propiedades</Link></li>
              <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mis Favoritos</Link></li>
              <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">Historial de Búsquedas</Link></li>
            </ul>
          </div>

          {/* Col 3: Links */}
          <div className="pt-[30px]">
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Términos de Servicio</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Uso de Datos (Scraping)</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} PropertyFinder. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Por Gustavo Gonzalez</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
