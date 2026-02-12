'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, AlertCircle, Copy, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signInEmail, signInGoogle } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MeprocentLogo, MeprocentText } from '@/components/logo';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(1, { message: 'Contraseña requerida.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [currentHost, setCurrentHost] = React.useState<string>('');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') setCurrentHost(window.location.hostname);
  }, []);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInEmail(values.email, values.password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Credenciales inválidas.' });
    } finally { setLoading(false); }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') setAuthError('domain');
      else if (error.code === 'auth/popup-closed-by-user') toast({ title: 'Aviso', description: 'Cerraste la ventana de Google.' });
      else toast({ variant: 'destructive', description: error.message });
    } finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="mb-6 flex flex-col items-center gap-4">
            <MeprocentLogo className="h-20 w-20" />
            <MeprocentText />
          </div>
          <CardTitle className="text-xl font-bold">Gestión Industrial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {authError === 'domain' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Dominio no autorizado</AlertTitle>
              <AlertDescription className="space-y-2">
                <p className="text-xs">Agregue este host en Firebase (Auth > Settings > Authorized domains):</p>
                <div className="flex items-center gap-2 bg-black/10 p-2 rounded text-[10px]">
                  <code className="flex-1">{currentHost}</code>
                  <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(currentHost); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Form {...useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <Input placeholder="email@meprocent.com" type="email" disabled={loading} />
              <Input placeholder="********" type="password" disabled={loading} />
              <Button onClick={onSubmit as any} className="w-full font-bold" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'ENTRAR'}
              </Button>
            </form>
          </Form>
          <div className="relative py-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">O</span></div></div>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
            Google Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}