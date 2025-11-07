// T102: 404 error page with navigation back to main pages
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/base/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/card';

// Hooks
// (handled via useTranslation and useEffect)

// Translations
// Uses common and notFound-specific translations

// Data Loading
// (none)

// Early Returns
// (none)

// Computed Data
// (none)

// Event Handlers
// (none - uses Link component)

// Effects
// SEO meta tags

export function NotFound() {
  // 1. HOOKS
  // (none)

  // 2. TRANSLATIONS
  const { t } = useTranslation();

  // 3. DATA LOADING
  const navigationCards = [
    {
      path: '/',
      title: t('navigation.home'),
      description: t('notFound.cards.home'),
    },
    {
      path: '/sales',
      title: t('navigation.sales'),
      description: t('notFound.cards.sales'),
    },
    {
      path: '/about',
      title: t('navigation.about'),
      description: t('notFound.cards.about'),
    },
    {
      path: '/career',
      title: t('navigation.career'),
      description: t('notFound.cards.career'),
    },
  ];

  // 4. EARLY RETURNS
  // (none)

  // 5. COMPUTED DATA
  // (none)

  // 6. EVENT HANDLERS
  // (none)

  // 7. EFFECTS
  useEffect(() => {
    // Set SEO meta tags for 404 page
    document.title = t('notFound.title') + ' | ' + t('company.name');

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('notFound.metaDescription'));
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = t('notFound.metaDescription');
      document.head.appendChild(newMetaDescription);
    }

    // Add noindex meta tag for 404 pages
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'noindex, follow');
    } else {
      const newMetaRobots = document.createElement('meta');
      newMetaRobots.name = 'robots';
      newMetaRobots.content = 'noindex, follow';
      document.head.appendChild(newMetaRobots);
    }

    // Cleanup: Remove noindex when component unmounts
    return () => {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.remove();
      }
    };
  }, [t]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-5xl px-6 py-16">
        {/* Error Message */}
        <div className="mb-12 text-center">
          <div className="mb-4 text-8xl font-bold text-primary">404</div>
          <h1 className="mb-4 text-3xl font-bold">
            {t('notFound.heading')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('notFound.message')}
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {navigationCards.map((card) => (
            <Card key={card.path} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  {card.description}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={card.path}>
                    {t('notFound.goTo')} {card.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to Home CTA */}
        <div className="text-center">
          <Button size="lg" asChild>
            <Link to="/">{t('notFound.backToHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
