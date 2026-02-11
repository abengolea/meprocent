
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
  Users,
  Settings,
  BarChart,
  Building,
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
import { useState } from 'react';
import { QrScanner } from './qr-scanner';
import { useUser } from '@/firebase';

const allNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'supervisor', 'tecnico', 'tecnico_senior'] },
  { href: '/empresas', label: 'Empresas', icon: Building, roles: ['admin'] },
  { href: '/users', label: 'Usuarios', icon: Users, roles: ['admin', 'supervisor'] },
  { href: '/equipment', label: 'Equipos', icon: HardHat, roles: ['admin', 'supervisor', 'tecnico', 'tecnico_senior'] },
  { href: '/interventions', label: 'Intervenciones', icon: Wrench, roles: ['admin', 'supervisor', 'tecnico', 'tecnico_senior'] },
  { href: '/alarms', label: 'Alarmas', icon: Siren, roles: ['admin', 'supervisor', 'tecnico', 'tecnico_senior'] },
  { href: '/plans', label: 'Planes Mtto.', icon: ClipboardList, roles: ['admin', 'supervisor'] },
  { href: '/reports', label: 'Reportes', icon: BarChart, roles: ['admin', 'supervisor'] },
  { href: '/settings', label: 'Configuración', icon: Settings, roles: ['admin'] },
];

export function MainNav() {
  const pathname = usePathname();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { profile } = useUser();

  const userRole = profile?.role || 'tecnico';
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <nav className="flex flex-col h-full">
       <div className="flex items-center gap-2 h-14 border-b px-4 shrink-0">
          <Mountain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">MaintWise</span>
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <SidebarMenuButton className="w-full justify-center">
                    <QrCode className="mr-2 h-4 w-4" />
                    Escanear QR
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Escanear Código QR de Equipo</DialogTitle>
                    <DialogDescription>
                        Apunte la cámara al código QR. Será redirigido automáticamente.
                    </DialogDescription>
                </DialogHeader>
                {dialogOpen && <QrScanner onScanSuccess={() => setDialogOpen(false)} />}
            </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}
