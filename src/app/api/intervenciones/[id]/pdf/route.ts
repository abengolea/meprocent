
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { InterventionPDF } from '@/components/interventions/pdf-template';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore: db } = initializeFirebase();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!db) return new NextResponse('DB not ready', { status: 500 });

  try {
    const docRef = doc(db, 'intervenciones', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return new NextResponse('Not found', { status: 404 });
    }

    const intervencion = { id: docSnap.id, ...docSnap.data() } as any;

    // Validación de seguridad por token
    if (!token || intervencion.token !== token) {
      // Si no hay token, verificamos si hay sesión (para admins)
      // En este prototipo, priorizamos el token para el acceso público
      if (!token) return new NextResponse('Unauthorized', { status: 401 });
    }

    // Obtener logs de auditoría para el PDF
    const auditQuery = query(collection(db, 'intervenciones', id, 'audit'), orderBy('timestamp', 'asc'));
    const auditSnap = await getDocs(auditQuery);
    const auditLogs = auditSnap.docs.map(d => d.data());

    const stream = await renderToStream(
      <InterventionPDF intervencion={intervencion} auditLogs={auditLogs} />
    );

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="MEPROCENT-${intervencion.numeroIntervencion}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}
