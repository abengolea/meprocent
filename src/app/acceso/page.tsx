'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Loader2, AlertCircle, Copy, Check, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signInEmail, signInGoogle } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MeprocentBrand } from '@/components/logo';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(1, { message: 'Contraseña requerida.' }),
});

export default function AccesoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [currentHost, setCurrentHost] = React.useState<string>('');
  const [copied, setCopied] = React.useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') setCurrentHost(window.location.hostname);
  }, []);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInEmail(values.email, values.password);
      router.push('/tablero');
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Credenciales inválidas.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInGoogle();
      router.push('/tablero');
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.error('Auth Error:', err.code, err.message);
      if (err.code === 'auth/unauthorized-domain') {
        setAuthError('domain');
      } else if (err.code === 'auth/popup-closed-by-user') {
        toast({ title: 'Ventana cerrada', description: 'Cerraste la ventana de Google antes de terminar.' });
      } else {
        toast({ variant: 'destructive', description: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al sitio
      </Link>
      <Card className="w-full max-w-md border-white/10 bg-card shadow-2xl">
        <CardHeader className="pb-2 text-center">
          <div className="mb-6 flex justify-center px-2 py-2">
            <MeprocentBrand size="xl" priority className="max-w-full" />
          </div>
          <CardTitle className="text-xl font-bold">Portal de gestión</CardTitle>
          <CardDescription>Acceso para clientes y equipo MEPROCENT</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authError === 'domain' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Dominio no autorizado</AlertTitle>
              <AlertDescription className="space-y-2">
                <p className="text-xs">
                  Para que el login de Google funcione, agregá este dominio en Firebase (Auth → Settings →
                  Authorized domains):
                </p>
                <div className="flex items-center gap-2 rounded bg-black/10 p-2 text-[10px]">
                  <code className="flex-1">{currentHost}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(currentHost);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@meprocent.com" type="email" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'ENTRAR'}
              </Button>
            </form>
          </Form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">O</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
            Google Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}