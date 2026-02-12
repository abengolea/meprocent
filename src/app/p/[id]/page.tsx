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
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <ShieldCheck className="w-4 h-4" />
                  CERTIFICADO
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg border border-border">
              <div>
                <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Equipo / Activo</p>
                <p className="font-medium text-base">{intervencion.equipoSnapshot.descripcion}</p>
                <p className="text-xs text-muted-foreground">{intervencion.equipoSnapshot.codigoInterno}</p>
              </div>
              <div>
                <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Técnico Responsable</p>
                <p className="font-medium text-base">{intervencion.tecnicoSnapshot.displayName}</p>
                <p className="text-xs text-muted-foreground">{formatDate(intervencion.fechaInicio as any, 'PPp')}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> 
                Resumen del Trabajo Realizado:
              </p>
              <div className="p-4 border rounded-md bg-white italic text-sm leading-relaxed shadow-sm">
                {intervencion.trabajoRealizado || 'Sin descripción detallada.'}
              </div>
            </div>

            {intervencion.locked ? (
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-green-200 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <p className="font-bold text-green-700 text-lg uppercase tracking-tight">SERVICIO FIRMADO Y CERTIFICADO</p>
                <p className="text-sm text-green-600 mt-1">Este expediente ha sido sellado y no admite modificaciones.</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full px-6">
                  <Button className="flex-1 h-12 text-lg font-bold" asChild>
                    <a href={`/api/intervenciones/${id}/pdf?token=${token}`} target="_blank">
                      <Download className="mr-2 h-5 w-5" /> Descargar PDF Oficial
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary">Nombre del Responsable</label>
                    <Input 
                      value={signerName} 
                      onChange={(e) => setSignerName(e.target.value)} 
                      placeholder="Ej: Juan Pérez" 
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary">DNI / Documento</label>
                    <Input 
                      value={signerDni} 
                      onChange={(e) => setSignerDni(e.target.value)} 
                      placeholder="Solo números" 
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary">Firma de Conformidad</label>
                  <SignaturePad onSave={setSignature} onClear={() => setSignature(null)} />
                </div>

                <Button 
                  className="w-full h-16 text-xl font-black shadow-xl hover:shadow-primary/20 transition-all" 
                  disabled={isSubmitting || !signature || !signerName || !signerDni}
                  onClick={handleSign}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2 h-6 w-6" /> : <ShieldCheck className="mr-2 h-6 w-6" />}
                  CERTIFICAR Y CERRAR EXPEDIENTE
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  Al presionar este botón, usted certifica la recepción conforme del servicio industrial realizado por MEPROCENT.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          MEPROCENT SOLUCIONES INDUSTRIALES - SISTEMA DE GESTIÓN DE CALIDAD ISO 9001
        </p>
      </div>
    </div>
  );
}