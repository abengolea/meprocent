import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Equipo } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Calendar, Wrench, ShieldCheck, Tag, Building, Info } from 'lucide-react';

interface EquipmentDetailsCardProps {
    equipo: Equipo;
}

export function EquipmentDetailsCard({ equipo }: EquipmentDetailsCardProps) {
    const details = [
        { icon: Tag, label: "Fabricante", value: equipo.fabricante || 'No especificado' },
        { icon: Tag, label: "Modelo", value: equipo.modelo || 'No especificado' },
        { icon: Tag, label: "N° de Serie", value: equipo.numeroSerie || 'No especificado' },
        { icon: Calendar, label: "Fecha de Instalación", value: equipo.fechaInstalacion ? formatDate(equipo.fechaInstalacion) : 'No especificado' },
        { icon: ShieldCheck, label: "Garantía hasta", value: equipo.garantiaHasta ? formatDate(equipo.garantiaHasta) : 'No especificado' },
        { icon: Building, label: "Ubicación", value: equipo.ubicacion ? `${equipo.ubicacion.planta} - ${equipo.ubicacion.sector}` : 'No especificado' },
    ];
    
    const techSpecs = equipo.caracteristicasTecnicas ? Object.entries(equipo.caracteristicasTecnicas) : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="w-5 h-5" /> Detalles del Equipo</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    {details.map(detail => (
                        <div key={detail.label} className="flex items-start gap-3">
                            <detail.icon className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                            <div>
                                <p className="text-muted-foreground">{detail.label}</p>
                                <p className="font-medium">{detail.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {techSpecs.length > 0 && (
                    <>
                        <Separator className="my-6" />
                        <h4 className="mb-4 text-md font-semibold tracking-tight">Características Técnicas</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            {techSpecs.map(([key, value]) => (
                                <div key={key} className="flex items-start gap-3">
                                    <Wrench className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                                    <div>
                                        <p className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</p>
                                        <p className="font-medium">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
