// T100: Navigation header block component - reusable site navigation
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/base/button';
import { cn } from '@/shared/lib/utils';
import { AnchorLinks } from '@/components/blocks/anchor-links/anchor-links';
import { usePageAnchors } from '@/shared/contexts/page-anchor-context';
import type { PageAnchorConfig } from '@/shared/types/page-config';

// Hooks
// (handled via useTranslation, useLocation, and usePageAnchors)

// Translations
// Uses common navigation translations

// Data Loading
// (none - static navigation links)

// Early Returns
// (none)

// Computed Data
// (path comparison for active state)

// Event Handlers
// (none - uses Link component)

// Effects
// (none)

export interface NavigationHeaderProps {
  className?: string;
  anchors?: PageAnchorConfig[];
  activeAnchorId?: string | null;
}

export function NavigationHeader({ className, anchors: anchorsProp, activeAnchorId: activeAnchorIdProp }: NavigationHeaderProps) {
  // 1. HOOKS
  const location = useLocation();
  const { anchors: anchorsContext, activeAnchorId: activeAnchorIdContext } = usePageAnchors();

  // Use props if provided, otherwise use context
  const anchors = anchorsProp ?? anchorsContext;
  const activeAnchorId = activeAnchorIdProp ?? activeAnchorIdContext;

  // 2. TRANSLATIONS
  const { t } = useTranslation();

  // 3. DATA LOADING
  const navigationLinks = [
    { path: '/', label: t('navigation.home') },
    { path: '/sales', label: t('navigation.sales') },
    { path: '/about', label: t('navigation.about') },
    { path: '/career', label: t('navigation.career') },
  ];

  // 4. EARLY RETURNS
  // (none)

  // 5. COMPUTED DATA
  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // 6. EVENT HANDLERS
  // (none)

  // 7. EFFECTS
  // (none)

  return (
    <nav className={cn('sticky top-0 z-50 border-b bg-background', className)}>
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-xl font-bold text-primary">
            {t('company.name')}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActivePath(link.path)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="hidden md:block">
          <Button size="sm" asChild>
            <Link to="/sales">{t('navigation.contact')}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          asChild
        >
          <Link to="/sales">{t('navigation.contact')}</Link>
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="border-t md:hidden">
        <div className="container mx-auto flex max-w-7xl items-center justify-around px-4 py-2">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-xs font-medium transition-colors',
                isActivePath(link.path)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Anchor Navigation - Desktop only */}
      {anchors && anchors.length > 0 && (
        <div className="hidden md:block">
          <AnchorLinks anchors={anchors} activeId={activeAnchorId} />
        </div>
      )}
    </nav>
  );
}
