'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  HardHat,
  Wrench,
  Siren,
  ClipboardList,
  QrCode,
  Mountain,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/equipment', label: 'Equipos', icon: HardHat },
  { href: '/interventions', label: 'Intervenciones', icon: Wrench },
  { href: '/alarms', label: 'Alarmas', icon: Siren },
  { href: '/plans', label: 'Planes', icon: ClipboardList },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full">
       <div className="flex items-center gap-2 h-14 border-b px-4 shrink-0">
          <Mountain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary-foreground">MaintWise</span>
        </div>

      <div className="flex-1 overflow-y-auto">
        <SidebarMenu className="p-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
       <div className="mt-auto p-4">
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenuButton className="w-full justify-center">
                    <QrCode className="mr-2 h-4 w-4" />
                    Escanear QR
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Escanear Código QR</DialogTitle>
                    <DialogDescription>
                        Funcionalidad de escáner QR próximamente. Apunte la cámara de su dispositivo al código QR del equipo para ver sus detalles.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                </div>
            </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}
