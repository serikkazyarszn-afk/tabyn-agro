import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const navLink = (href: string) => `/${locale}${href}`;

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                <path d="M16 2L16 8M16 8L12 12M16 8L20 12M12 12L12 20M20 12L20 20M12 20L16 24M20 20L16 24M16 24L16 30" stroke="#a8e63d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14L4 18M24 14L28 18" stroke="#a8e63d" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="font-bold text-lg">Tabyn<span className="text-accent">Argo</span></span>
            </div>
            <p className="text-muted text-sm max-w-xs">{t('tagline')}</p>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">{t('platform')}</h4>
            <ul className="space-y-2">
              <li><Link href={navLink('/animals')} className="text-sm text-muted hover:text-foreground transition-colors">{t('animals')}</Link></li>
              <li><Link href={navLink('/#how-it-works')} className="text-sm text-muted hover:text-foreground transition-colors">{t('howItWorks')}</Link></li>
              <li><Link href={navLink('/signup?role=farmer')} className="text-sm text-muted hover:text-foreground transition-colors">{t('forFarmers')}</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">{t('company')}</h4>
            <ul className="space-y-2">
              <li><Link href={navLink('/')} className="text-sm text-muted hover:text-foreground transition-colors">{t('about')}</Link></li>
              <li><Link href={navLink('/')} className="text-sm text-muted hover:text-foreground transition-colors">{t('contact')}</Link></li>
              <li><Link href={navLink('/')} className="text-sm text-muted hover:text-foreground transition-colors">{t('privacy')}</Link></li>
              <li><Link href={navLink('/')} className="text-sm text-muted hover:text-foreground transition-colors">{t('terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex items-center justify-between">
          <p className="text-xs text-muted">© {new Date().getFullYear()} TabynArgo. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
