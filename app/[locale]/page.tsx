import Hero from '@/components/landing/hero';
import HowItWorks from '@/components/landing/how-it-works';
import Benefits from '@/components/landing/benefits';
import FieldGallery from '@/components/landing/field-gallery';
import Philosophy from '@/components/landing/philosophy';
import FeaturedAnimals from '@/components/landing/featured-animals';
import ProfitSharing from '@/components/landing/profit-sharing';
import TrustSection from '@/components/landing/trust-section';
import { createClient } from '@/lib/supabase-server';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Hero locale={locale} user={user} />
      <HowItWorks />
      <Benefits />
      <FieldGallery locale={locale} />
      <Philosophy />
      <FeaturedAnimals locale={locale} />
      <ProfitSharing />
      <TrustSection />
    </>
  );
}
