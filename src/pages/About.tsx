// T058: About page layout with company information sections
import * as React from 'react';
import { useTranslation } from 'react-i18next';

// Block Components
import { CustomerLogoWall } from '@/components/blocks/customer-logo-wall/customer-logo-wall';
import { ProjectGallery } from '@/components/blocks/project-gallery/project-gallery';
import { TestimonialSlider } from '@/components/blocks/testimonial-slider/testimonial-slider';
import { CTACard } from '@/components/blocks/cta-card/cta-card';

// Data
import { mockCustomerLogos } from '@/shared/data/mock-customers';
import { mockProjectReferences } from '@/shared/data/mock-projects';
import { mockTestimonials } from '@/shared/data/mock-testimonials';
import { mockCertifications } from '@/shared/data/mock-certifications';
import { mockNews } from '@/shared/data/mock-news';

// Hooks
import { useAnchorScroll } from '@/shared/hooks/use-anchor-scroll';

// Hooks
const useAboutPage = () => {
  useAnchorScroll();

  const customerTestimonials = mockTestimonials.filter(t => t.type === 'customer');

  return {
    customerTestimonials
  };
};

// Translations
// Handled by useTranslation hook

// Data Loading
// Mock data loaded from imports

// Early Returns
// No early returns needed

// Computed Data
// Handled in hook

// Event Handlers
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', `#${sectionId}`);
  }
};

// Effects
// Handled in useAnchorScroll hook

export function About() {
  const { t } = useTranslation();
  const { customerTestimonials } = useAboutPage();

  // T073: SEO Meta Tags - Set document title and meta
  React.useEffect(() => {
    document.title = 'Über pacon Real Estate – Mission, Werte, Referenzen, Zertifikate';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'pacon Real Estate: Mission, Werte, regionale Präsenz, Referenzen und Zertifikate. Erfahren Sie, warum Kunden uns vertrauen.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* T059: Page Header */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('about.introduction')}
          </p>
        </div>
      </section>

      {/* T060: Internal Anchor Navigation */}
      <section className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex flex-wrap justify-center gap-4">
            {[
              { key: 'mission', id: 'mission' },
              { key: 'values', id: 'values' },
              { key: 'regions', id: 'regions' },
              { key: 'references', id: 'references' },
              { key: 'testimonials', id: 'testimonials' },
              { key: 'certifications', id: 'certifications' },
              { key: 'customers', id: 'customers' },
              { key: 'news', id: 'news' }
            ].map(({ key, id }) => (
              <button
                key={key}
                onClick={() => scrollToSection(id)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-md transition-colors"
              >
                {t(`about.navigation.${key}`)}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* T061: Mission Section */}
      <section id="mission" className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t('about.mission.title')}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('about.mission.text')}
          </p>
        </div>
      </section>

      {/* T062: Values Section */}
      <section id="values" className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('about.values.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['quality', 'trust', 'innovation', 'team'].map((value) => (
              <div key={value} className="text-center p-6 bg-background rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">
                  {t(`about.values.${value}.title`)}
                </h3>
                <p className="text-muted-foreground">
                  {t(`about.values.${value}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* T063: Regional Presence Section */}
      <section id="regions" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">{t('about.regions.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('about.regions.description')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {['berlin', 'hamburg', 'heidelberg'].map((region) => (
            <div key={region} className="text-center p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">
                {t(`about.regions.${region}.title`)}
              </h3>
              <p className="text-muted-foreground">
                {t(`about.regions.${region}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* T064: References Section */}
      <section id="references" className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">{t('about.references.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('about.references.description')}
            </p>
          </div>
          <ProjectGallery projects={mockProjectReferences} />
        </div>
      </section>

      {/* T065: Customer Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('about.testimonials.title')}
        </h2>
        <TestimonialSlider testimonials={customerTestimonials} type="customer" />
      </section>

      {/* T066: Certifications Section */}
      <section id="certifications" className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">{t('about.certifications.title')}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('about.certifications.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto mb-8">
            {mockCertifications.map((cert) => (
              <div key={cert.id} className="text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                  <img
                    src={cert.badgeUrl}
                    alt={`${cert.name} Badge`}
                    className="max-w-12 max-h-12 object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold mb-2">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
                {cert.validUntil && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Gültig bis: {new Date(cert.validUntil).toLocaleDateString('de-DE')}
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {t('about.certifications.note')}
          </p>
        </div>
      </section>

      {/* T067: Customer Logos Section */}
      <section id="customers" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('about.customers.title')}
        </h2>
        <CustomerLogoWall logos={mockCustomerLogos} />
      </section>

      {/* T068: News Section */}
      <section id="news" className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('about.news.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {mockNews.map((news) => (
              <div key={news.id} className="bg-background p-6 rounded-lg shadow-sm">
                <p className="text-sm text-muted-foreground mb-3">
                  {new Date(news.publishDate).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <h3 className="text-xl font-semibold mb-3">{news.title}</h3>
                <p className="text-muted-foreground">{news.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* T069: CTA Cards Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <CTACard
            title={t('about.cta.sales.title')}
            description={t('about.cta.sales.description')}
            buttonText="Angebot anfordern"
            href="/sales"
            variant="primary"
          />
          <CTACard
            title={t('about.cta.career.title')}
            description={t('about.cta.career.description')}
            buttonText="Karriere entdecken"
            href="/career"
            variant="secondary"
          />
          <CTACard
            title={t('about.cta.contact.title')}
            description={t('about.cta.contact.description')}
            buttonText="Kontakt aufnehmen"
            href="/contact"
            variant="secondary"
          />
        </div>
      </section>
    </div>
  );
}
