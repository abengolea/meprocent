'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, AlertCircle, Copy, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signInEmail, signInGoogle } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MeprocentLogo, MeprocentText } from '@/components/logo';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor ingrese un correo válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [currentHost, setCurrentHost] = React.useState<string>('');
  const [copied, setCopied] = React.useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHost(window.location.hostname);
    }
  }, []);

  const handleFirebaseError = (error: any) => {
    console.error('Error de Firebase:', error);
    let message = 'Ocurrió un error inesperado.';
    
    if (error.code === 'auth/unauthorized-domain') {
      setAuthError('dominio_no_autorizado');
      message = 'Este dominio no está autorizado en la consola de Firebase.';
    } else if (error.code === 'auth/popup-blocked') {
      message = 'El navegador bloqueó la ventana emergente. Por favor, habilita las ventanas emergentes e intenta de nuevo.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      message = 'La ventana de inicio de sesión fue cerrada antes de completar el proceso.';
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      message = 'Email o contraseña incorrectos.';
    } else {
      message = error.message || 'No se pudo iniciar sesión.';
    }

    toast({
      variant: 'destructive',
      title: 'Aviso de Acceso',
      description: message,
    });
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInEmail(values.email, values.password);
      toast({
        title: 'Acceso Correcto',
        description: 'Bienvenido al sistema MEPROCENT.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInGoogle();
      toast({
        title: 'Acceso Correcto',
        description: 'Bienvenido al sistema MEPROCENT.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  }

  const copyHost = () => {
    navigator.clipboard.writeText(currentHost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copiado',
      description: 'Dominio copiado al portapapeles.',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-sm shadow-2xl border-none">
        <CardHeader className="text-center pb-2">
          <div className="mb-6 flex flex-col justify-center items-center gap-4">
            <MeprocentLogo className="h-24 w-24" />
            <MeprocentText className="text-center" />
          </div>
          <CardTitle className="text-xl font-bold text-secondary">Gestión de Mantenimiento</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder al sistema industrial.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authError === 'dominio_no_autorizado' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Dominio no autorizado</AlertTitle>
              <AlertDescription className="space-y-2">
                <p className="text-xs">
                  Agrega este host exacto en Firebase (Auth {'>'} Authorized domains):
                </p>
                <div className="flex items-center gap-2 bg-destructive-foreground/10 p-2 rounded border border-destructive/20">
                  <code className="text-[10px] break-all flex-1 font-mono">{currentHost}</code>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyHost}>
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
                    <FormLabel className="text-secondary font-semibold">Usuario / Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@meprocent.com"
                        {...field}
                        type="email"
                        disabled={loading}
                        className="bg-muted/50 border-secondary/20"
                      />
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
                    <FormLabel className="text-secondary font-semibold">Contraseña</FormLabel>
                    <FormControl>
                      <Input placeholder="********" {...field} type="password" disabled={loading} className="bg-muted/50 border-secondary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold h-12 text-lg shadow-lg hover:shadow-primary/20 transition-all" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Validando...' : 'ENTRAR AL SISTEMA'}
              </Button>
            </form>
          </Form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                O acceder con
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full h-12 border-2 border-secondary/10 hover:bg-secondary hover:text-white transition-colors" onClick={handleGoogleLogin} disabled={loading}>
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.85 1.62-4.75 0-8.58-3.9-8.58-8.6s3.83-8.6 8.58-8.6c2.6 0 4.5 1.05 5.5 2.05l2.4-2.3c-1.5-1.4-3.4-2.3-5.9-2.3-5.25 0-9.55 4.3-9.55 9.55s4.3 9.55 9.55 9.55c3.1 0 5.2-1.05 6.85-2.65 1.8-1.8 2.35-4.35 2.35-7.6s-.05-1.15-.1-1.65z"></path></svg>
            Google Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}