// External Libraries
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

// Components
import { Button } from "@/components/base/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card";
import { TestimonialSlider } from "@/components/blocks/testimonial-slider/testimonial-slider";
import { JobFilter } from "@/components/features/job-filter/job-filter";
import { JobListing } from "@/components/blocks/job-listing/job-listing";
import { TeamSection } from "@/components/blocks/team-section/team-section";
import { ApplicationForm } from "@/components/features/application-form/application-form";
import { JobDetailDialog } from "@/components/features/job-detail-dialog/job-detail-dialog";
import { CTASection } from "@/components/blocks/cta-section/cta-section";
import { HeroCounter } from "@/components/blocks/hero/HeroCounter";

// Data
import { mockJobListings } from "@/shared/data/mock-jobs";
import { mockTeamProfiles } from "@/shared/data/mock-team";
import { mockBenefits } from "@/shared/data/mock-benefits";
import { mockTestimonials } from "@/shared/data/mock-testimonials";

// Types
import type { LocationFilter } from "@/shared/lib/form-validation";
import type { PageAnchorConfig } from "@/shared/types/page-config";

// Context
import { usePageAnchors } from "@/shared/contexts/page-anchor-context";
import { useScrollSpy } from "@/shared/hooks/use-scroll-spy";

// Hooks

// Translations

// Data Loading

// Early Returns

// Computed Data

// Event Handlers

// Effects

export function Career() {
  // Hooks
  const [searchParams] = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState<LocationFilter>("Alle");
  const [prefilledJobTitle, setPrefilledJobTitle] = useState("");
  const [jobDetailDialogOpen, setJobDetailDialogOpen] = useState(false);
  const [selectedJobKey, setSelectedJobKey] = useState<string | null>(null);
  const { setAnchors, setActiveAnchorId } = usePageAnchors();

  // Translations
  const { t } = useTranslation();

  // Define anchor navigation (memoized)
  const anchors = useState<PageAnchorConfig[]>(() => [
    { id: 'jobs', label: 'Offene Stellen', i18nKey: 'career.navigation.jobs' },
    { id: 'team', label: 'Team', i18nKey: 'career.navigation.team' },
    { id: 'benefits', label: 'Benefits', i18nKey: 'career.navigation.benefits' },
    { id: 'bewerben', label: 'Bewerben', i18nKey: 'career.navigation.apply' },
  ])[0];

  const sectionIds = useState(() => anchors.map((a) => a.id))[0];
  const activeSectionId = useScrollSpy(sectionIds);

  // Data Loading

  // Early Returns

  // Computed Data
  const filteredJobs = mockJobListings.filter(job => {
    if (selectedLocation === "Alle") return job.active;

    // Load job data from i18n to get location
    const jobData = t(`jobs.${job.i18nKey}`, { returnObjects: true }) as { location: string };
    return job.active && jobData?.location === selectedLocation;
  });

  const sortedBenefits = mockBenefits.sort((a, b) => a.displayOrder - b.displayOrder);

  // Event Handlers
  const handleLocationChange = (location: LocationFilter) => {
    setSelectedLocation(location);
  };

  const handleJobApply = (jobTitle: string) => {
    setPrefilledJobTitle(jobTitle);
    // Scroll to application form
    document.getElementById('bewerben')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToJobs = () => {
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToApplication = () => {
    document.getElementById('bewerben')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewJobDetails = (jobI18nKey: string) => {
    setSelectedJobKey(jobI18nKey);
    setJobDetailDialogOpen(true);
  };

  const handleJobApplyFromDialog = (jobTitle: string) => {
    setPrefilledJobTitle(jobTitle);
    setJobDetailDialogOpen(false);
    // Scroll to application form
    setTimeout(() => {
      document.getElementById('bewerben')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Effects
  // Set anchors in context
  useEffect(() => {
    setAnchors(anchors);
    return () => setAnchors([]);
  }, [setAnchors]);

  useEffect(() => {
    setActiveAnchorId(activeSectionId);
  }, [activeSectionId, setActiveAnchorId]);

  // SEO meta tags (T098)
  useEffect(() => {
    document.title = "Karriere bei pacon – Jobs im Facility Management, Service, Projekte";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Offene Stellen, Team und Benefits bei pacon Real Estate. Jetzt bewerben oder initiativ starten.');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = 'Offene Stellen, Team und Benefits bei pacon Real Estate. Jetzt bewerben oder initiativ starten.';
      document.head.appendChild(newMeta);
    }
  }, []);

  // Check for job parameter in URL
  useEffect(() => {
    const job = searchParams.get('job');
    if (job) {
      setPrefilledJobTitle(job);
      // Wait for DOM to render, then scroll to form
      setTimeout(() => {
        document.getElementById('bewerben')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - FR-029 */}
      <HeroCounter
        badge="Jetzt bewerben"
        heading={t("career.heroTitle")}
        description={t("career.heroSubtitle")}
        features={[
          "Flexible Arbeitszeitmodelle",
          "Weiterbildung & Entwicklung",
          "Attraktive Benefits",
          "Teamorientierte Kultur"
        ]}
        stats={[
          { number: 150, label: "Mitarbeiter", suffix: "+" },
          { number: 30, label: "Jahre Erfahrung", suffix: "+" },
          { number: 3, label: "Standorte", suffix: "" },
          { number: 95, label: "Mitarbeiterzufriedenheit", suffix: "%" },
        ]}
        imageUrl="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
        imageAlt="pacon Team"
        primaryButtonText={t("career.viewPositions")}
        secondaryButtonText={t("career.applyUnsolicited")}
        onPrimaryClick={handleScrollToJobs}
        onSecondaryClick={handleScrollToApplication}
      />

      {/* Employee Testimonials Section - FR-030 */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("career.employeeTestimonialsTitle")}
          </h2>
          <TestimonialSlider testimonials={mockTestimonials} type="employee" />
        </div>
      </section>

      {/* Open Positions Section - FR-031 to FR-033 */}
      <section id="jobs" className="scroll-mt-24 py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("career.openPositionsTitle")}
          </h2>

          <div className="mb-8 flex justify-center">
            <JobFilter
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
            />
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {t("career.noPositionsMessage")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobListing
                  key={job.id}
                  job={job}
                  onViewDetails={handleViewJobDetails}
                  onApply={handleJobApply}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Unsolicited Application Section - FR-034 */}
      <section id="initiativ" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t("career.unsolicitedTitle")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t("career.unsolicitedDescription")}
          </p>
          <Button
            size="lg"
            onClick={() => {
              setPrefilledJobTitle("Initiativbewerbung");
              handleScrollToApplication();
            }}
          >
            {t("career.applyUnsolicited")}
          </Button>
        </div>
      </section>

      {/* Team Section - FR-035 */}
      <section id="team" className="scroll-mt-24 bg-muted/30">
        <div className="container mx-auto max-w-6xl pt-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("career.teamTitle")}
          </h2>
        </div>
        <TeamSection
          members={mockTeamProfiles}
          showHeader={false}
          showCTA={false}
        />
      </section>

      {/* Benefits Section - FR-036 */}
      <section id="benefits" className="scroll-mt-24 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("career.benefitsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBenefits.map((benefit) => (
              <Card key={benefit.id} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section - FR-037 to FR-040 */}
      <section id="bewerben" className="scroll-mt-24 py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <ApplicationForm
            prefilledJobTitle={prefilledJobTitle}
            onSubmitSuccess={() => {
              // Reset prefilled job title after successful submission
              setPrefilledJobTitle("");
            }}
          />
        </div>
      </section>

      {/* CTA Cards Section - T096 */}
      <CTASection
        items={[
          {
            title: t("career.ctaApplicationTitle"),
            description: t("career.ctaApplicationDescription"),
            buttonText: t("career.ctaApplicationButton"),
            variant: "primary",
            href: "#bewerben"
          },
          {
            title: t("career.ctaInitiativeTitle"),
            description: t("career.ctaInitiativeDescription"),
            buttonText: t("career.ctaInitiativeButton"),
            variant: "secondary",
            href: "#bewerben"
          },
          {
            title: t("career.ctaAboutTitle"),
            description: t("career.ctaAboutDescription"),
            buttonText: t("career.ctaAboutButton"),
            variant: "secondary",
            href: "/about"
          }
        ]}
      />

      {/* Job Detail Dialog */}
      <JobDetailDialog
        jobI18nKey={selectedJobKey}
        open={jobDetailDialogOpen}
        onOpenChange={setJobDetailDialogOpen}
        onApply={handleJobApplyFromDialog}
      />
    </div>
  );
}
