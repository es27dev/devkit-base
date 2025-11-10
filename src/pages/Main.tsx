import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Button } from "@/components/base/button";
import { Card, CardContent } from "@/components/base/card";

// Block Components
import { HeroSection } from "@/components/blocks/hero-section/hero-section";
import { ServiceCard } from "@/components/blocks/service-card/service-card";
import { CustomerLogoWall } from "@/components/blocks/customer-logo-wall/customer-logo-wall";
import { ProjectGallery } from "@/components/blocks/project-gallery/project-gallery";
import { CTASection } from "@/components/blocks/cta-section/cta-section";

// Mock Data
import { mockServices } from "@/shared/data/mock-services";
import { mockCustomerLogos } from "@/shared/data/mock-customers";
import { mockProjectReferences } from "@/shared/data/mock-projects";

export function Main() {
  // 1. Hooks
  // 2. Translations
  const { t } = useTranslation();

  // 3. Data Loading

  // 4. Early Returns

  // 5. Computed Data

  // 6. Event Handlers

  // 7. Effects
  useEffect(() => {
    // Set SEO meta tags for main landing page
    document.title = "pacon Real Estate – Facility Management, Betreiberverantwortung, Referenzen";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'pacon optimiert den Gebäudebetrieb: FM, Compliance, Energie, Digitalisierung. Regional stark. Jetzt Angebot anfordern.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'pacon optimiert den Gebäudebetrieb: FM, Compliance, Energie, Digitalisierung. Regional stark. Jetzt Angebot anfordern.';
      document.head.appendChild(newMetaDescription);
    }

    // Add keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'facility management, betreiberverantwortung, gebäudebetrieb, referenzen, pacon, real estate');
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = 'facility management, betreiberverantwortung, gebäudebetrieb, referenzen, pacon, real estate';
      document.head.appendChild(newMetaKeywords);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* T029, T030: Hero Section with H1 and dual CTAs */}
      <HeroSection
        title={t("main.hero.title")}
        description={t("main.hero.subtitle")}
        variant="landing"
        primaryButton={{
          text: t("main.hero.primaryCta"),
          href: "/sales"
        }}
        secondaryButton={{
          text: t("main.hero.secondaryCta"),
          href: "/career"
        }}
      />

      {/* T031: Unsere Kernleistungen Section with 5 service bullets and link to /about#leistungen */}
      <section className="bg-muted/50 px-6 py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                {t("main.services.title")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("main.services.description")}
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockServices.slice(0, 5).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" asChild>
                <a href="/about#leistungen">{t("main.services.learnMore")}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* T032: "Vertraut von bekannten Kunden" logo wall with link to /about#kunden */}
      <section className="px-6 py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">
                {t("main.customers.title")}
              </h2>
            </div>

            <CustomerLogoWall logos={mockCustomerLogos} />

            <div className="text-center">
              <Button variant="ghost" asChild>
                <a href="/about#kunden">{t("main.customers.viewAll")}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* T033: "Regional stark vertreten" section with locations and link to /about#regionen */}
      <section className="bg-muted/50 px-6 py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">
                {t("main.regions.title")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("main.regions.description")}
              </p>
            </div>

            {/* Locations */}
            <div className="grid gap-6 md:grid-cols-3">
              {["berlin", "hamburg", "heidelberg"].map((location) => (
                <Card key={location}>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-lg">
                      {t(`main.regions.${location}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t(`main.regions.${location}.description`)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" asChild>
                <a href="/about#regionen">{t("main.regions.viewLocations")}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* T034: "Objektbilder und Projekte" gallery section with link to /about#referenzen */}
      <section className="px-6 py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">
                {t("main.projects.title")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("main.projects.description")}
              </p>
            </div>

            <ProjectGallery projects={mockProjectReferences.slice(0, 6)} />

            <div className="text-center">
              <Button variant="outline" asChild>
                <a href="/about#referenzen">{t("main.projects.viewReferences")}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* T035: "Unsere Mission" teaser with sustainability message */}
      <section className="bg-muted/50 px-6 py-16">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              {t("main.mission.title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("main.mission.description")}
            </p>
          </div>
        </div>
      </section>

      {/* T036: Three CTA cards at page end linking to /sales, /career, and /about */}
      <CTASection
        items={[
          {
            title: t("main.cta.sales.title"),
            description: t("main.cta.sales.description"),
            buttonText: t("main.cta.sales.button"),
            href: "/sales",
            variant: "primary"
          },
          {
            title: t("main.cta.career.title"),
            description: t("main.cta.career.description"),
            buttonText: t("main.cta.career.button"),
            href: "/career",
            variant: "secondary"
          },
          {
            title: t("main.cta.about.title"),
            description: t("main.cta.about.description"),
            buttonText: t("main.cta.about.button"),
            href: "/about",
            variant: "secondary"
          }
        ]}
      />
    </div>
  );
}