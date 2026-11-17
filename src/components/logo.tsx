'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Logotipo horizontal con transparencia */
const BRAND_LOGO = '/brand/meprocent-logo.png';
/** Isotipo casco (transparencia) — favicon, sidebar, etc. */
const BRAND_MARK = '/brand/meprocent-mark.png';
const LOGO_AR = 1024 / 341;

const SIZE_PX = {
  xs: 32,
  sm: 44,
  md: 56,
  lg: 68,
  xl: 88,
  '2xl': 92,
} as const;

type BrandSize = keyof typeof SIZE_PX;

type MeprocentBrandProps = {
  className?: string;
  priority?: boolean;
  size?: BrandSize;
  /** Altura en px (sobreescribe size). */
  heightPx?: number;
  /** Logo completo o solo isotipo (casco). */
  variant?: 'full' | 'mark';
};

export function MeprocentBrand({
  className,
  priority,
  size = 'md',
  heightPx,
  variant = 'full',
}: MeprocentBrandProps) {
  const height = heightPx ?? SIZE_PX[size];

  if (variant === 'mark') {
    return (
      <Image
        src={BRAND_MARK}
        alt="MEPROCENT"
        width={1024}
        height={1024}
        priority={priority}
        className={cn('h-auto w-auto shrink-0 select-none', className)}
        style={{ height, width: height }}
        sizes={`${height}px`}
      />
    );
  }

  return (
    <Image
      src={BRAND_LOGO}
      alt="MEPROCENT Soluciones Industriales SRL"
      width={1024}
      height={341}
      priority={priority}
      className={cn('h-auto w-auto select-none', className)}
      style={{ height, width: 'auto', maxWidth: height * LOGO_AR }}
      sizes="(max-width: 640px) 280px, 420px"
    />
  );
}

/** @deprecated Usar MeprocentBrand variant="mark" */
export function MeprocentLogo({ className }: { className?: string }) {
  return <MeprocentBrand variant="mark" size="md" className={className} />;
}

/** @deprecated Usar MeprocentBrand variant="full" */
export function MeprocentText({
  className,
  subtext = true,
  size = 'md',
}: {
  className?: string;
  subtext?: boolean;
  size?: BrandSize;
}) {
  return <MeprocentBrand variant="full" size={size} className={className} />;
}