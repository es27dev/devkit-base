// React Core
import { useState, useEffect } from "react";

// External Libraries
import { useTranslation } from "react-i18next";

// Base Components
import { Button } from "@/components/base/button";
import { Card, CardContent } from "@/components/base/card";

// Block Components
import { CTASection } from "@/components/blocks/cta-section/cta-section";
import { HeroBuilder } from "@/components/blocks/hero/HeroBuilder";

// Mock Data
import { mockServices } from "@/shared/data/mock-services";
import { mockProjectReferences } from "@/shared/data/mock-projects";

// Feature Components
import { ContactForm } from "@/components/features/contact-form/contact-form";

// Types
import type { PageAnchorConfig } from "@/shared/types/page-config";

// Context
import { usePageAnchors } from "@/shared/contexts/page-anchor-context";
import { useScrollSpy } from "@/shared/hooks/use-scroll-spy";

export function Sales() {
  // 1. Hooks
  const { t } = useTranslation();
  const { setAnchors, setActiveAnchorId } = usePageAnchors();

  // Define anchor navigation (memoized)
  const anchors = useState<PageAnchorConfig[]>(() => [
    { id: 'services', label: 'Leistungen', i18nKey: 'sales.navigation.services' },
    { id: 'process', label: 'Ablauf', i18nKey: 'sales.navigation.process' },
    { id: 'projects', label: 'Projekte', i18nKey: 'sales.navigation.projects' },
    { id: 'kontakt', label: 'Kontakt', i18nKey: 'sales.navigation.contact' },
  ])[0];

  const sectionIds = useState(() => anchors.map((a) => a.id))[0];
  const activeSectionId = useScrollSpy(sectionIds);

  // 2. Translations
  // (handled by useTranslation hook)

  // 3. Data Loading
  const services = mockServices.sort((a, b) => a.displayOrder - b.displayOrder);
  const projects = mockProjectReferences.slice(0, 6).sort((a, b) => a.displayOrder - b.displayOrder);

  // 4. Early Returns
  // (none needed)

  // 5. Computed Data
  // (handled above)

  // 6. Event Handlers
  const scrollToContact = () => {
    const contactElement = document.getElementById('kontakt');
    contactElement?.scrollIntoView({ behavior: 'smooth' });
  };

  // 7. Effects
  // Set anchors in context
  useEffect(() => {
    setAnchors(anchors);
    return () => setAnchors([]);
  }, [setAnchors]);

  useEffect(() => {
    setActiveAnchorId(activeSectionId);
  }, [activeSectionId, setActiveAnchorId]);

  // SEO meta tags - T056
  useEffect(() => {
    // Set page title and meta description (from spec)
    document.title = "pacon Sales – Angebot für Facility Management und Betreiberverantwortung";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Angebot für Gebäudebetrieb anfordern: FM, Compliance, Energie, Digitalisierung. Klarer Ablauf, feste Ansprechpartner.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Angebot für Gebäudebetrieb anfordern: FM, Compliance, Energie, Digitalisierung. Klarer Ablauf, feste Ansprechpartner.';
      document.head.appendChild(meta);
    }

    // Cleanup on unmount
    return () => {
      document.title = 'pacon Real Estate';
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Hero Section - T042 (FR-009) */}
      <HeroBuilder
        heading="Profis für Ihren Gebäudebetrieb"
        description="Wartung, Instandhaltung, Services – messbar, sicher, wirtschaftlich"
        stats={[
          { number: 10000, label: "Anlagen gewartet", suffix: "+" },
          { number: 400000, label: "m² Fläche betreut", suffix: "" },
          { number: 30, label: "Jahre Erfahrung", suffix: "+" },
          { number: 99, label: "Kundenzufriedenheit", suffix: "%" },
        ]}
        primaryImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
        secondaryImages={{
          image1: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
          image2: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
        }}
        imageAlt="pacon Gebäudebetrieb"
        primaryButtonText="Angebot anfordern"
        secondaryButtonText="Mehr erfahren"
        onPrimaryClick={scrollToContact}
      />

      {/* Core Services Section - T043 (FR-010) */}
      <section id="services" className="scroll-mt-24 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Unsere Kernleistungen</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="h-full">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process Section - T044 (FR-011) */}
      <section id="process" className="scroll-mt-24 py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">So läuft die Implementation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-2xl font-bold text-primary">Phase 1</div>
                <h3 className="text-xl font-semibold">Vorbereitungsphase</h3>
                <p className="text-muted-foreground">
                  Detaillierte Bestandsaufnahme, Prozessanalyse und individuelle Konzepterstellung für Ihr Objekt.
                </p>
                <Button variant="outline" onClick={scrollToContact} className="w-full">
                  Unverbindlich anfragen
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-2xl font-bold text-primary">Phase 2</div>
                <h3 className="text-xl font-semibold">Implementierung</h3>
                <p className="text-muted-foreground">
                  Schrittweise Übernahme aller FM-Prozesse mit nahtloser Integration in bestehende Strukturen.
                </p>
                <Button variant="outline" onClick={scrollToContact} className="w-full">
                  Unverbindlich anfragen
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-2xl font-bold text-primary">Phase 3</div>
                <h3 className="text-xl font-semibold">Laufender Betrieb</h3>
                <p className="text-muted-foreground">
                  Kontinuierliche Optimierung, regelmäßiges Reporting und proaktive Anpassungen.
                </p>
                <Button variant="outline" onClick={scrollToContact} className="w-full">
                  Unverbindlich anfragen
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Gallery Section - T045 (FR-012) */}
      <section id="projects" className="scroll-mt-24 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Objektbilder und Projekte</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">
                    Projektbild: {project.title}
                  </div>
                </div>
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - T046-T054 Contact Form Implementation */}
      <section id="kontakt" className="scroll-mt-24 py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold">Jetzt kaufen</h2>
            <p className="text-muted-foreground">
              Kontaktieren Sie uns für ein unverbindliches Angebot
            </p>
          </div>

          {/* Contact Form Component - T046-T054 */}
          <ContactForm />
        </div>
      </section>

      {/* CTA Cards Section - T055 */}
      <CTASection
        items={[
          {
            title: "Arbeiten bei pacon",
            description: "Entdecken Sie spannende Karrierechancen in unserem Team",
            buttonText: "Stellenausschreibungen",
            href: "/career",
            variant: "primary"
          },
          {
            title: "Über pacon",
            description: "Erfahren Sie mehr über unser Unternehmen und unsere Werte",
            buttonText: "Mehr erfahren",
            href: "/about",
            variant: "secondary"
          }
        ]}
      />
    </div>
  );
}