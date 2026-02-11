'use client';

import { cn } from '@/lib/utils';

export function MeprocentLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={cn("h-10 w-10", className)}
    >
      {/* Spartan Helmet Crest / Penacho */}
      <path 
        d="M20 45C20 25 40 10 75 15C65 25 60 40 65 55L20 45Z" 
        fill="currentColor" 
        className="text-primary"
      />
      {/* Helmet Face / Máscara */}
      <path 
        d="M30 40V75L45 85L55 75L65 85L80 75V40H30ZM45 65H35V50H45V65ZM75 65H65V50H75V65Z" 
        fill="currentColor" 
        className="text-foreground"
      />
      {/* Decorative Line */}
      <path d="M30 40C45 35 65 35 80 40" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
    </svg>
  );
}

export function MeprocentText({ className, subtext = true }: { className?: string, subtext?: boolean }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-2xl font-black tracking-tighter leading-none">MEPROCENT</span>
      {subtext && (
        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
          Soluciones Industriales
        </span>
      )}
    </div>
  );
}