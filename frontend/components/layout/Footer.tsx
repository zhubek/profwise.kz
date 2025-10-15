'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/dashboard" className="inline-block">
              <span className="text-lg font-bold md:text-xl">ProfWise</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('copyright', { year: currentYear })}
            </p>
          </div>

          {/* Links - Column 1 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">{t('about')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links - Column 2 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar - Mobile stacked, Desktop single row */}
        <div className="mt-6 border-t pt-6 flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            {t('copyright', { year: currentYear })}
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ in Kazakhstan
          </p>
        </div>
      </div>
    </footer>
  );
}
