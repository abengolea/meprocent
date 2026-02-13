import type { Metadata } from "next";
import { PlansList } from "@/components/plans/plans-list";
import { getPlanes } from "@/lib/mock-data";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Planes de Mantenimiento | MEPROCENT",
  description: "Gestión de planes de mantenimiento preventivo.",
};

export default function PlansPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Planes de Mantenimiento</h1>
        <p className="text-muted-foreground">
          Planes de mantenimiento preventivo para sus equipos.
        </p>
      </div>

      <Suspense fallback={<PlansSkeleton />}>
        <PlansLoader />
      </Suspense>
    </div>
  );
}

async function PlansLoader() {
    const planes = await getPlanes();
    return <PlansList planes={planes} />;
}

const PlansSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
            </Card>
        ))}
    </div>
)
