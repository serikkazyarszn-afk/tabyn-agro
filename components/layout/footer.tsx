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
            <div className="flex items-center mb-3">
              <img src="/logo.png" alt="Tabyn" className="h-55 w-auto object-contain" />
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
          <p className="text-xs text-muted">© {new Date().getFullYear()} Tabyn. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
