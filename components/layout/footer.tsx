import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { TabynWordmark } from '@/components/ui/logo';
import { ShieldCheck, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const navLink = (href: string) => `/${locale}${href}`;

  return (
    <footer className="border-t border-border-700 mt-24 bg-bg-950">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
          {/* Brand column */}
          <div className="md:col-span-4">
            <TabynWordmark className="h-[78px] w-auto" markSize={26} />
            <p className="text-text-secondary text-[14px] leading-relaxed mt-4 max-w-xs">
              {t('tagline')}
            </p>

            <div className="mt-6 space-y-2.5 text-[13px]">
              <div className="flex items-center gap-2 text-text-tertiary">
                <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                <span>{t('trustNote')}</span>
              </div>
              <div className="flex items-center gap-2 text-text-tertiary">
                <MapPin className="w-3.5 h-3.5" />
                <span>{t('region')}</span>
              </div>
              <div className="flex items-center gap-2 text-text-tertiary">
                <Mail className="w-3.5 h-3.5" />
                <a
                  href="mailto:hello@tabyn.kz"
                  className="hover:text-text-primary transition-colors"
                >
                  hello@tabyn.kz
                </a>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h4 className="text-[12px] font-semibold text-text-primary uppercase tracking-[0.08em] mb-4">
              {t('platform')}
            </h4>
            <ul className="space-y-2.5">
              <FooterLink href={navLink('/animals')}>{t('animals')}</FooterLink>
              <FooterLink href={navLink('/#how-it-works')}>{t('howItWorks')}</FooterLink>
              <FooterLink href={navLink('/signup?role=farmer')}>{t('forFarmers')}</FooterLink>
              <FooterLink href={navLink('/#trust')}>{t('verification')}</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="text-[12px] font-semibold text-text-primary uppercase tracking-[0.08em] mb-4">
              {t('company')}
            </h4>
            <ul className="space-y-2.5">
              <FooterLink href={navLink('/')}>{t('about')}</FooterLink>
              <FooterLink href={navLink('/')}>{t('contact')}</FooterLink>
              <FooterLink href={navLink('/')}>{t('press')}</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="text-[12px] font-semibold text-text-primary uppercase tracking-[0.08em] mb-4">
              {t('legal')}
            </h4>
            <ul className="space-y-2.5">
              <FooterLink href={navLink('/')}>{t('terms')}</FooterLink>
              <FooterLink href={navLink('/')}>{t('privacy')}</FooterLink>
              <FooterLink href={navLink('/')}>{t('disclosures')}</FooterLink>
              <FooterLink href={navLink('/')}>{t('riskWarning')}</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4 className="text-[12px] font-semibold text-text-primary uppercase tracking-[0.08em] mb-4">
              {t('support')}
            </h4>
            <ul className="space-y-2.5">
              <FooterLink href={navLink('/')}>{t('help')}</FooterLink>
              <FooterLink href={navLink('/')}>{t('status')}</FooterLink>
              <FooterLink href="mailto:support@tabyn.kz">support@tabyn.kz</FooterLink>
            </ul>
          </div>
        </div>

        {/* Disclaimer strip */}
        <div className="border-t border-border-700 pt-6">
          <p className="text-[12px] text-text-tertiary leading-relaxed max-w-4xl mb-4">
            {t('disclaimer')}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[12px] text-text-tertiary">
              © {new Date().getFullYear()} Tabyn. {t('rights')}
            </p>
            <p className="text-[12px] text-text-tertiary tabular">
              {t('currencyNote') /* Цены указаны в ₸ (KZT) */}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
