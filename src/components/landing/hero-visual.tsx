import { MeprocentBrand } from '@/components/logo';

/** Ilustración técnica del hero — sin fotos de fondo. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
      <div className="landing-hero-panel relative aspect-[4/5] w-full max-w-[22rem] overflow-hidden rounded-sm border border-white/10 bg-[#172636] shadow-2xl shadow-black/40 lg:ml-auto lg:max-w-none">
        <svg
          className="absolute inset-0 h-full w-full text-white/[0.07]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        <Template className="absolute inset-0 mx-auto h-[72%] w-[68%] translate-y-6 text-primary/90" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-gradient-to-t from-black/50 to-transparent p-5">
          <p className="font-headline text-xs font-semibold uppercase tracking-[0.25em] text-primary">API 653</p>
          <p className="mt-1 text-sm font-medium text-white/90">Inspección de tanques certificada</p>
        </div>

        <div className="landing-hero-scan pointer-events-none absolute inset-0 opacity-40" />
      </div>

      <div className="absolute -bottom-6 -left-4 hidden rounded-sm border border-white/10 bg-secondary/95 p-4 shadow-xl backdrop-blur-sm sm:block lg:-left-10">
        <div className="flex items-center gap-3">
          <MeprocentBrand variant="mark" size="lg" />
          <div>
            <p className="font-headline text-sm font-bold uppercase tracking-wide text-white">Integridad</p>
            <p className="text-xs text-white/60">Estáticos · presión · piping</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 top-8 hidden rounded-full border border-primary/30 bg-primary/10 px-4 py-2 lg:block">
        <span className="font-headline text-xs font-semibold uppercase tracking-widest text-primary">ISO 18436</span>
      </div>
    </div>
  );
}

/** Tanque estilizado — líneas de ingeniería */
function Template({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="38" rx="72" ry="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path
        d="M28 38 L28 195 Q28 220 100 220 Q172 220 172 195 L172 38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <ellipse cx="100" cy="195" rx="72" ry="14" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <path d="M100 52 L100 180" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 6" opacity="0.35" />
      <rect x="118" y="120" width="36" height="22" rx="2" stroke="currentColor" strokeWidth="1.25" opacity="0.6" />
      <path d="M82 230 L118 230 M100 220 L100 248" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <circle cx="100" cy="95" r="28" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <circle cx="100" cy="95" r="4" fill="currentColor" opacity="0.8" />
    </svg>
  );
}