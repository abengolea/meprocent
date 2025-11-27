import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number, formatStr: string = 'PP') {
  if (!date) return '';
  return format(new Date(date), formatStr, { locale: es });
}

export function capitalize(s: string) {
  if (typeof s !== 'string' || s.length === 0) {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}
