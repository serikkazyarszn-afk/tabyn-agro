import Hero from '@/components/landing/hero';
import HowItWorks from '@/components/landing/how-it-works';
import Benefits from '@/components/landing/benefits';
import FeaturedAnimals from '@/components/landing/featured-animals';
import ProfitSharing from '@/components/landing/profit-sharing';
import TrustSection from '@/components/landing/trust-section';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Hero locale={locale} />
      <HowItWorks />
      <Benefits />
      <FeaturedAnimals locale={locale} />
      <ProfitSharing />
      <TrustSection />
    </>
  );
}
