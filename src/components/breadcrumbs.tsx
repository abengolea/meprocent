'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === '/dashboard') return null;

  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    
    // Naive title case, replace hyphens
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

    return { name, href, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center space-x-2 text-sm">
      <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
        Dashboard
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <Fragment key={breadcrumb.href}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link
            href={breadcrumb.href}
            aria-current={breadcrumb.isLast ? 'page' : undefined}
            className={cn(
              'hover:text-foreground',
              breadcrumb.isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}
          >
            {breadcrumb.name}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
