import AnimalsCatalogClient from './_client';

export default function AnimalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <AnimalsCatalogClient params={params} />;
}
