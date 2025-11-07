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
import { TeamProfile } from "@/components/blocks/team-profile/team-profile";
import { ApplicationForm } from "@/components/features/application-form/application-form";

// Data
import { mockJobListings } from "@/shared/data/mock-jobs";
import { mockTeamProfiles } from "@/shared/data/mock-team";
import { mockBenefits } from "@/shared/data/mock-benefits";
import { mockTestimonials } from "@/shared/data/mock-testimonials";

// Types
import type { LocationFilter } from "@/shared/lib/form-validation";

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

  // Translations
  const { t } = useTranslation();

  // Data Loading

  // Early Returns

  // Computed Data
  const filteredJobs = mockJobListings.filter(job => {
    if (selectedLocation === "Alle") return job.active;
    return job.active && job.location === selectedLocation;
  });

  const sortedTeam = mockTeamProfiles.sort((a, b) => a.displayOrder - b.displayOrder);
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

  // Effects
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
      <section className="relative py-24 px-4 text-center bg-gradient-to-b from-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("career.heroTitle")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t("career.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleScrollToJobs}>
              {t("career.viewPositions")}
            </Button>
            <Button size="lg" variant="outline" onClick={handleScrollToApplication}>
              {t("career.applyUnsolicited")}
            </Button>
          </div>
        </div>
      </section>

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
      <section id="jobs" className="py-16 px-4 bg-muted/30">
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
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("career.teamTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedTeam.map((member) => (
              <TeamProfile key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - FR-036 */}
      <section className="py-16 px-4">
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
      <section className="py-16 px-4 bg-muted/30">
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
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">{t("career.ctaApplicationTitle")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("career.ctaApplicationDescription")}
                </p>
                <Button onClick={handleScrollToApplication}>
                  {t("career.ctaApplicationButton")}
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">{t("career.ctaInitiativeTitle")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("career.ctaInitiativeDescription")}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPrefilledJobTitle("Initiativbewerbung");
                    handleScrollToApplication();
                  }}
                >
                  {t("career.ctaInitiativeButton")}
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">{t("career.ctaAboutTitle")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("career.ctaAboutDescription")}
                </p>
                <Button variant="outline" asChild>
                  <a href="/about">{t("career.ctaAboutButton")}</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
