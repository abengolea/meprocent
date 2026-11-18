'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MeprocentBrand } from '@/components/logo';
import { Button } from '@/components/ui/button';

const NAV = [
  { href: '#empresa', label: 'Empresa' },
  { href: '#carpeta', label: 'Carpeta' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#metodologia', label: 'Metodología' },
  { href: '#equipo', label: 'Equipo' },
  { href: '#contacto', label: 'Contacto' },
] as const;

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'border-b border-white/10 bg-[#14263b]/95 shadow-lg shadow-black/25 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[5.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:h-24 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center py-1" onClick={() => setOpen(false)}>
          <MeprocentBrand size="2xl" priority className="max-w-[min(88vw,24rem)] sm:max-w-[28rem]" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide text-white/80 transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="outline" size="sm" className="border-white/25 bg-transparent text-white hover:bg-white/10">
            <Link href="/acceso">Portal</Link>
          </Button>
          <Button asChild size="sm" className="font-semibold">
            <a href="#contacto">Consultar</a>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-secondary md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label="Móvil">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-base font-medium text-white/90 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-4">
              <Button asChild variant="outline" className="border-white/25 bg-transparent text-white">
                <Link href="/acceso" onClick={() => setOpen(false)}>
                  Portal de gestión
                </Link>
              </Button>
              <Button asChild>
                <a href="#contacto" onClick={() => setOpen(false)}>
                  Solicitar consulta
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}