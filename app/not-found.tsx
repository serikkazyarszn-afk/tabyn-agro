import Link from 'next/link';
import Button from '@/components/ui/button';
import { TabynMark } from '@/components/ui/logo';
import { ArrowLeft, Compass, LifeBuoy } from 'lucide-react';

/**
 * Route-level not-found page.
 *
 * This file sits at the app root so it catches any /... URL that does
 * not map to a locale-scoped page. Within a locale, next-intl may
 * render its own localised 404 via notFound() — that is fine; this is
 * a neutral fallback for edge routes (typos, broken sitemap entries).
 */
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Ambient horizon — consistent with login/signup panes */}
      <div className="absolute inset-0 gradient-horizon opacity-55 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(900px 500px at 30% -5%, rgba(79,162,109,0.14), transparent 60%)',
        }}
      />

      <div className="relative w-full max-w-[480px] text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-[14px] bg-surface-900 border border-border-700 mb-6">
          <TabynMark size={28} className="text-brand" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand mb-2">
          404
        </p>
        <h1 className="text-[32px] md:text-[38px] font-semibold tracking-[-0.02em] text-text-primary leading-[1.1]">
          Page not found
        </h1>
        <p className="mt-3 text-[14.5px] text-text-secondary leading-[1.6]">
          This route does not exist on Tabyn. The URL may have moved, been
          renamed, or never been published in the first place.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="primary" size="md" fullWidth className="sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              Back home
            </Button>
          </Link>
          <Link href="/en/animals">
            <Button variant="secondary" size="md" fullWidth className="sm:w-auto">
              <Compass className="w-4 h-4" />
              Browse catalog
            </Button>
          </Link>
        </div>

        <a
          href="mailto:support@tabyn.kz"
          className="mt-8 inline-flex items-center gap-2 text-[12.5px] text-text-tertiary hover:text-text-primary transition-colors"
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          support@tabyn.kz
        </a>
      </div>
    </main>
  );
}
