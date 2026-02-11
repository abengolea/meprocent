
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { Intervencion, AuditLog } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottom: 2, borderBottomColor: '#1a2b3c', paddingBottom: 10 },
  logo: { width: 60, height: 60 },
  companyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a2b3c' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', backgroundColor: '#f3f4f6', padding: 5, marginTop: 15, marginBottom: 10 },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 120, fontWeight: 'bold', color: '#4b5563' },
  value: { flex: 1 },
  table: { marginTop: 10, borderTop: 1, borderTopColor: '#e5e7eb' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f9fafb', padding: 5, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottom: 1, borderBottomColor: '#e5e7eb', padding: 5 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTop: 1, borderTopColor: '#e5e7eb', paddingTop: 10, textAlign: 'center', color: '#9ca3af', fontSize: 8 },
  signature: { marginTop: 30, alignItems: 'center' },
  signatureImage: { width: 150, height: 60, marginBottom: 5 }
});

interface InterventionPDFProps {
  intervencion: Intervencion;
  auditLogs: any[];
}

export const InterventionPDF = ({ intervencion, auditLogs }: InterventionPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.companyTitle}>MEPROCENT</Text>
          <Text>Soluciones Industriales</Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text style={{ fontWeight: 'bold' }}>Expediente: {intervencion.numeroIntervencion}</Text>
          <Text>Fecha: {formatDate(intervencion.fechaInicio as any)}</Text>
          <Text>Estado: CERTIFICADO</Text>
        </View>
      </View>

      <View style={styles.sectionTitle}>
        <Text>DATOS DEL CLIENTE Y EQUIPO</Text>
      </View>
      <View style={styles.row}><Text style={styles.label}>Cliente:</Text><Text style={styles.value}>{intervencion.empresaId}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Equipo:</Text><Text style={styles.value}>{intervencion.equipoSnapshot.descripcion} ({intervencion.equipoSnapshot.codigoInterno})</Text></View>
      <View style={styles.row}><Text style={styles.label}>Ubicación:</Text><Text style={styles.value}>{intervencion.equipoSnapshot.ubicacion}</Text></View>

      <View style={styles.sectionTitle}>
        <Text>EJECUCIÓN TÉCNICA</Text>
      </View>
      <View style={styles.row}><Text style={styles.label}>Técnico:</Text><Text style={styles.value}>{intervencion.tecnicoSnapshot.displayName}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Servicio:</Text><Text style={styles.value}>{intervencion.tipoIntervencion.toUpperCase()}</Text></View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Trabajo Realizado:</Text>
        <Text style={{ lineHeight: 1.4 }}>{intervencion.trabajoRealizado}</Text>
      </View>

      {intervencion.consumptions && intervencion.consumptions.length > 0 && (
        <>
          <View style={styles.sectionTitle}>
            <Text>CONTROL DE INSUMOS QUÍMICOS</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={{ width: '20%' }}>Código</Text>
              <Text style={{ width: '60%' }}>Producto / Registro</Text>
              <Text style={{ width: '20%', textAlign: 'right' }}>Cantidad</Text>
            </View>
            {intervencion.consumptions.map((c, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={{ width: '20%', fontWeight: 'bold' }}>{c.internalCode}</Text>
                <Text style={{ width: '60%' }}>{c.name}</Text>
                <Text style={{ width: '20%', textAlign: 'right' }}>{c.qty} {c.unit}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {intervencion.signature && (
        <View style={styles.signature} break={false}>
          <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>CONFORMIDAD DEL CLIENTE</Text>
          <Image src={intervencion.signature.image} style={styles.signatureImage} />
          <Text>{intervencion.signature.name}</Text>
          <Text>DNI: {intervencion.signature.dni}</Text>
          <Text>Firmado el: {formatDate(intervencion.signature.timestamp as any, 'PPPPp')}</Text>
        </View>
      )}

      <Text style={styles.footer}>
        Este documento ha sido generado electrónicamente y posee validez de certificación técnica. 
        MEPROCENT SOLUCIONES INDUSTRIALES - ID: {intervencion.token}
      </Text>
    </Page>
  </Document>
);
