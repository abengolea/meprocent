'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

const BRAND_LOGO = '/brand/meprocent-logo.jpg';
const LOGO_AR = 1024 / 409;

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
      <span
        className={cn('relative inline-flex shrink-0 overflow-hidden', className)}
        style={{ width: height, height }}
      >
        <Image
          src={BRAND_LOGO}
          alt="MEPROCENT"
          fill
          priority={priority}
          className="object-cover object-left select-none"
          sizes={`${height}px`}
        />
      </span>
    );
  }

  return (
    <Image
      src={BRAND_LOGO}
      alt="MEPROCENT Soluciones Industriales SRL"
      width={1024}
      height={409}
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