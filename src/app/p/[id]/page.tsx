'use client';

import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Intervencion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SignaturePad } from '@/components/interventions/signature-pad';
import { MeprocentLogo, MeprocentText } from '@/components/logo';
import { CheckCircle2, Loader2, Download, AlertTriangle, FileText, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { writeAuditLog } from '@/lib/audit';
import { Badge } from '@/components/ui/badge';

export default function PublicInterventionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const db = useFirestore();
  const { toast } = useToast();
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const token = searchParams.get('token');
  
  const [signerName, setSignerName] = React.useState('');
  const [signerDni, setSignerDni] = React.useState('');
  const [signature, setSignature] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const docRef = React.useMemo(() => (db && id ? doc(db, 'intervenciones', id) : null), [db, id]);
  const { data: intervencion, loading } = useDoc<Intervencion>(docRef);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  if (!intervencion || intervencion.token !== token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p className="text-muted-foreground">El link de certificación es inválido o ha expirado.</p>
      </div>
    );
  }

  const handleSign = async () => {
    if (!signature || !signerName || !signerDni || !db || !id) {
      toast({ variant: 'destructive', title: 'Error', description: 'Por favor completa todos los campos y firma.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'intervenciones', id), {
        signature: {
          image: signature,
          name: signerName,
          dni: signerDni,
          timestamp: new Date().toISOString(),
        },
        locked: true,
        estado: 'cerrada',
        closedAt: serverTimestamp(),
      });

      await writeAuditLog({
        db,
        interventionId: id,
        action: 'SIGNED',
        userId: 'CLIENT_PUBLIC',
        userName: signerName,
        payload: { dni: signerDni, method: 'public_portal' }
      });

      toast({ title: 'Servicio Certificado', description: 'Has firmado el documento correctamente.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo procesar la firma.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col items-center gap-4 mb-8">
          <MeprocentLogo className="h-16 w-16" />
          <MeprocentText className="text-center" />
        </div>

        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">Certificación de Servicio</CardTitle>
                <CardDescription>Expediente N° {intervencion.numeroIntervencion}</CardDescription>
              </div>
              {intervencion.locked && (
                <Badge variant="secondary" className="bg-green-100 text-green-800"><ShieldCheck className="w-3 h-3 mr-1"/> CERTIFICADO</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg">
              <div>
                <p className="font-bold text-muted-foreground uppercase text-[10px]">Equipo / Activo</p>
                <p className="font-medium">{intervencion.equipoSnapshot.descripcion}</p>
                <p className="text-xs text-muted-foreground">{intervencion.equipoSnapshot.codigoInterno}</p>
              </div>
              <div>
                <p className="font-bold text-muted-foreground uppercase text-[10px]">Técnico Responsable</p>
                <p className="font-medium">{intervencion.tecnicoSnapshot.displayName}</p>
                <p className="text-xs text-muted-foreground">{formatDate(intervencion.fechaInicio as any, 'PPp')}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-sm flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Trabajo Realizado:</p>
              <div className="p-4 border rounded-md bg-white italic text-sm">
                {intervencion.trabajoRealizado || 'Sin descripción detallada.'}
              </div>
            </div>

            {intervencion.locked ? (
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-green-200 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <p className="font-bold text-green-700 uppercase">SERVICIO FIRMADO Y CERTIFICADO</p>
                <Button className="mt-8" asChild>
                  <a href={`/api/intervenciones/${id}/pdf?token=${token}`} target="_blank">
                    <Download className="mr-2 h-5 w-5" /> Descargar PDF Oficial
                  </a>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nombre del Responsable</label>
                    <Input value={signerName} onChange={(e) => setSignerName(e.target.value)} placeholder="Ej: Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">DNI / Documento</label>
                    <Input value={signerDni} onChange={(e) => setSignerDni(e.target.value)} placeholder="Solo números" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Firma de Conformidad</label>
                  <SignaturePad onSave={setSignature} onClear={() => setSignature(null)} />
                </div>

                <Button 
                  className="w-full h-14 text-lg font-bold" 
                  disabled={isSubmitting || !signature || !signerName || !signerDni}
                  onClick={handleSign}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                  CERTIFICAR SERVICIO
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}