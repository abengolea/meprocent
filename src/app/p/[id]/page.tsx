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
import { CheckCircle2, Loader2, Download, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { writeAuditLog } from '@/lib/audit';

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
  const [isSubmitting, setIsSignining] = React.useState(false);

  const docRef = React.useMemo(() => (db && id ? doc(db, 'intervenciones', id) : null), [db, id]);
  const { data: intervencion, loading } = useDoc<Intervencion>(docRef);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  if (!intervencion || intervencion.token !== token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p className="text-muted-foreground">El link es inválido o ha expirado.</p>
      </div>
    );
  }

  const handleSign = async () => {
    if (!signature || !signerName || !signerDni || !db || !id) {
      toast({ variant: 'destructive', title: 'Error', description: 'Por favor completa todos los campos y firma.' });
      return;
    }

    setIsSignining(true);
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
      setIsSignining(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col items-center gap-4 mb-8">
          <MeprocentLogo className="h-16 w-16" />
          <MeprocentText className="text-center" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Certificación de Servicio</CardTitle>
                <CardDescription>Expediente N° {intervencion.numeroIntervencion}</CardDescription>
              </div>
              {intervencion.locked && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/api/intervenciones/${id}/pdf?token=${token}`} target="_blank">
                    <Download className="mr-2 h-4 w-4" /> PDF
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg">
              <div>
                <p className="font-bold text-muted-foreground uppercase text-[10px]">Equipo</p>
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
              <p className="font-bold text-sm">Trabajo Realizado:</p>
              <div className="p-4 border rounded-md bg-white italic text-sm leading-relaxed">
                {intervencion.trabajoRealizado || 'Sin descripción detallada.'}
              </div>
            </div>

            {intervencion.locked ? (
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-green-200 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                <p className="font-bold text-green-700">SERVICIO FIRMADO Y CERTIFICADO</p>
                <p className="text-xs text-green-600 mt-1">El documento ha sido bloqueado para auditoría.</p>
                <Button className="mt-6" asChild>
                   <a href={`/api/intervenciones/${id}/pdf?token=${token}`} target="_blank">
                    <Download className="mr-2 h-4 w-4" /> Descargar Copia Certificada
                  </a>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre del Responsable</label>
                    <Input value={signerName} onChange={(e) => setSignerName(e.target.value)} placeholder="Ej: Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">DNI / Documento</label>
                    <Input value={signerDni} onChange={(e) => setSignerDni(e.target.value)} placeholder="Solo números" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Firma de Conformidad</label>
                  <SignaturePad onSave={setSignature} onClear={() => setSignature(null)} />
                </div>

                <Button 
                  className="w-full h-14 text-lg font-bold" 
                  disabled={isSubmitting || !signature || !signerName || !signerDni}
                  onClick={handleSign}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <FileText className="mr-2" />}
                  CERTIFICAR Y FINALIZAR
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
          MEPROCENT SOLUCIONES INDUSTRIALES - Sistema de Gestión de Calidad
        </p>
      </div>
    </div>
  );
}
