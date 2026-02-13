import { redirect } from 'next/navigation';

/**
 * Redirección legacy: /p/[id] → /certificar/[id]
 * Mantiene compatibilidad con links ya enviados a clientes.
 */
export default function PLegacyPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token?: string };
}) {
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const token = searchParams?.token;
  const query = token ? `?token=${token}` : '';
  redirect(`/certificar/${id}${query}`);
}
