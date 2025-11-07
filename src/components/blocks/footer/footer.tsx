// T101: Footer block component - site footer with contact and legal links
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';

// Hooks
// (handled via useTranslation)

// Translations
// Uses common and footer-specific translations

// Data Loading
// (none - static footer content)

// Early Returns
// (none)

// Computed Data
// (none)

// Event Handlers
// (none - uses Link component)

// Effects
// (none)

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  // 1. HOOKS
  // (none)

  // 2. TRANSLATIONS
  const { t } = useTranslation();

  // 3. DATA LOADING
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { path: '/about', label: t('navigation.about') },
    { path: '/sales', label: t('navigation.sales') },
    { path: '/career', label: t('navigation.career') },
  ];

  const legalLinks = [
    { path: '/impressum', label: t('footer.legal.impressum') },
    { path: '/datenschutz', label: t('footer.legal.datenschutz') },
  ];

  const locations = [
    { name: t('locations.berlin'), address: 'Berlin' },
    { name: t('locations.hamburg'), address: 'Hamburg' },
    { name: t('locations.heidelberg'), address: 'Heidelberg' },
  ];

  // 4. EARLY RETURNS
  // (none)

  // 5. COMPUTED DATA
  // (none)

  // 6. EVENT HANDLERS
  // (none)

  // 7. EFFECTS
  // (none)

  return (
    <footer className={cn('border-t bg-muted/50', className)}>
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="text-lg font-bold text-primary">
              {t('company.name')}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('company.description')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('company.tagline')}
            </p>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              {t('footer.company.title')}
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              {t('footer.locations.title')}
            </h3>
            <ul className="space-y-2">
              {locations.map((location) => (
                <li key={location.name} className="text-sm text-muted-foreground">
                  {location.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              {t('footer.contact.title')}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <a
                  href="mailto:info@pacon-re.de"
                  className="transition-colors hover:text-foreground"
                >
                  info@pacon-re.de
                </a>
              </p>
              <p>
                <a
                  href="tel:+49301234567"
                  className="transition-colors hover:text-foreground"
                >
                  +49 30 123 456 7
                </a>
              </p>
            </div>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {t('company.name')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
