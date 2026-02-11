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
import { useState, useEffect } from 'react';
import { QrScanner } from './qr-scanner';
import { useUser } from '@/firebase';
import { MeprocentLogo, MeprocentText } from './logo';

const allNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'super_admin', 'supervisor', 'tecnico', 'tecnico_senior'] },
  { href: '/empresas', label: 'Empresas', icon: Building, roles: ['admin', 'super_admin'] },
  { href: '/users', label: 'Usuarios', icon: Users, roles: ['admin', 'super_admin', 'supervisor'] },
  { href: '/equipment', label: 'Equipos', icon: HardHat, roles: ['admin', 'super_admin', 'supervisor', 'tecnico', 'tecnico_senior'] },
  { href: '/interventions', label: 'Intervenciones', icon: Wrench, roles: ['admin', 'super_admin', 'supervisor', 'tecnico', 'tecnico_senior'] },
  { href: '/alarms', label: 'Alarmas', icon: Siren, roles: ['admin', 'super_admin', 'supervisor', 'tecnico', 'tecnico_senior'] },
  { href: '/plans', label: 'Planes Mtto.', icon: ClipboardList, roles: ['admin', 'super_admin', 'supervisor'] },
  { href: '/reports', label: 'Reportes', icon: BarChart, roles: ['admin', 'super_admin', 'supervisor'] },
  { href: '/settings', label: 'Configuración', icon: Settings, roles: ['admin', 'super_admin'] },
];

export function MainNav() {
  const pathname = usePathname();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { profile } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRole = profile?.role || 'tecnico';
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <nav className="flex flex-col h-full bg-sidebar">
       <div className="flex items-center gap-3 h-20 border-b border-sidebar-border px-4 shrink-0">
          <MeprocentLogo className="h-10 w-10" />
          <MeprocentText className="text-white" subtext={false} />
        </div>

      <div className="flex-1 overflow-y-auto">
        <SidebarMenu className="p-2 gap-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                className="justify-start h-10 px-3 hover:bg-sidebar-accent"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
       <div className="mt-auto p-4">
        {mounted && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                  <SidebarMenuButton className="w-full justify-center h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                      <QrCode className="mr-2 h-5 w-5" />
                      <span className="font-bold">Escanear Equipo</span>
                  </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                      <DialogTitle>Escanear Código QR de Equipo</DialogTitle>
                      <DialogDescription>
                          Apunte la cámara al código QR. MEPROCENT le dirigirá automáticamente.
                      </DialogDescription>
                  </DialogHeader>
                  {dialogOpen && <QrScanner onScanSuccess={() => setDialogOpen(false)} />}
              </DialogContent>
          </Dialog>
        )}
      </div>
    </nav>
  );
}
