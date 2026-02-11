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
      {/* Círculo de fondo Azul Marino #1a2b3c */}
      <circle cx="50" cy="50" r="48" className="fill-secondary" />
      
      {/* Casco Espartano - Penacho Naranja #f07d22 */}
      <path 
        d="M25 45C25 25 45 15 75 20C65 30 62 45 65 60L25 45Z" 
        className="fill-primary"
      />
      
      {/* Casco Espartano - Máscara Blanca/Gris para contraste */}
      <path 
        d="M35 42V70L50 80L65 70L65 42H35ZM48 60H40V50H48V60ZM60 60H52V50H60V60Z" 
        fill="white"
      />
      
      {/* Línea de detalle del casco */}
      <path d="M35 42C45 38 55 38 65 42" stroke="white" strokeWidth="2" />
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