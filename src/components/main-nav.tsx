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
  FlaskConical,
  Bug,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
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
import { QrScanner } from './equipment/qr-scanner';
import { useUser } from '@/firebase';
import { MeprocentLogo, MeprocentText } from './logo';

const rolesEquipos = ['admin', 'super_admin', 'supervisor', 'tecnico', 'tecnico_senior'];

const allNavItems = [
  { href: '/tablero', label: 'Tablero', icon: LayoutDashboard, roles: ['admin', 'super_admin', 'supervisor', 'tecnico', 'tecnico_senior'] },
  { href: '/empresas', label: 'Empresas', icon: Building, roles: ['admin', 'super_admin'] },
  { href: '/usuarios', label: 'Usuarios', icon: Users, roles: ['admin', 'super_admin', 'supervisor'] },
  { href: '/mantenimiento/equipos', label: 'Equipos', icon: HardHat, roles: rolesEquipos, section: 'mantenimiento' },
  { href: '/mantenimiento/intervenciones', label: 'Intervenciones', icon: Wrench, roles: rolesEquipos, section: 'mantenimiento' },
  { href: '/fumigacion/equipos', label: 'Equipos', icon: Bug, roles: rolesEquipos, section: 'fumigacion' },
  { href: '/fumigacion/intervenciones', label: 'Intervenciones', icon: Wrench, roles: rolesEquipos, section: 'fumigacion' },
  { href: '/alarmas', label: 'Alarmas', icon: Siren, roles: ['admin', 'super_admin', 'supervisor', 'tecnico', 'tecnico_senior'] },
  { href: '/insumos', label: 'Insumos', icon: FlaskConical, roles: ['admin', 'super_admin', 'supervisor'] },
  { href: '/planes', label: 'Planes Mtto.', icon: ClipboardList, roles: ['admin', 'super_admin', 'supervisor'] },
  { href: '/reportes', label: 'Reportes', icon: BarChart, roles: ['admin', 'super_admin', 'supervisor'] },
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

  const topItems = navItems.filter(i => !('section' in i) || !i.section);
  const mantenimientoItems = navItems.filter(i => 'section' in i && i.section === 'mantenimiento');
  const fumigacionItems = navItems.filter(i => 'section' in i && i.section === 'fumigacion');

  const renderItem = (item: (typeof allNavItems)[0]) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton
        asChild
        isActive={pathname === item.href || (item.href !== '/tablero' && pathname.startsWith(item.href))}
        className="justify-start h-10 px-3 hover:bg-sidebar-accent"
      >
        <Link href={item.href}>
          <item.icon className="h-5 w-5 mr-3" />
          <span className="font-medium">{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const order = ['/tablero', '/empresas', '/usuarios', 'mantenimiento', 'fumigacion', '/alarmas', '/insumos', '/planes', '/reportes', '/settings'];

  return (
    <nav className="flex flex-col h-full bg-sidebar">
       <div className="flex items-center gap-3 h-20 border-b border-sidebar-border px-4 shrink-0">
          <MeprocentLogo className="h-10 w-10" />
          <MeprocentText className="text-white" subtext={false} />
        </div>

      <div className="flex-1 overflow-y-auto">
        <SidebarMenu className="p-2 gap-1">
          {order.map((key) => {
            if (key === 'mantenimiento') {
              if (mantenimientoItems.length === 0) return null;
              return (
                <SidebarGroup key="mantenimiento">
                  <SidebarGroupLabel>Mantenimiento</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {mantenimientoItems.map(renderItem)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            }
            if (key === 'fumigacion') {
              if (fumigacionItems.length === 0) return null;
              return (
                <SidebarGroup key="fumigacion">
                  <SidebarGroupLabel>Fumigación</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {fumigacionItems.map(renderItem)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            }
            const item = topItems.find(i => i.href === key);
            return item ? renderItem(item) : null;
          })}
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
