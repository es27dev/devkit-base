import { useMemo, useState } from "react";
import { HeroBuilder } from "@/components/blocks/hero/HeroBuilder";

import { HeroCounter } from "@/components/blocks/hero/HeroCounter";

import { ImageGallery } from "@/components/features/product-feature/image-gallery";
import { ProductFeatureProvider } from "@/components/features/product-feature/product-feature";

import { ChevronLeft } from "lucide-react";

export default function Home() {
  const [heroChoice, setHeroChoice] = useState(false);

  const featurePages = useMemo(
    () => [
      {
        titleKey: "pacon.featureAccordion.facility-management-technical",
        featureKey: "facility-management-technical",
      },
      {
        titleKey: "pacon.featureAccordion.facility-management-infrastructural",
        featureKey: "facility-management-infrastructural",
      },
      {
        titleKey: "pacon.featureAccordion.facility-management-caretaker",
        featureKey: "facility-management-caretaker",
      },
      {
        titleKey: "pacon.featureAccordion.facility-management-consulting",
        featureKey: "facility-management-consulting",
      },
    ],
    []
  );

  const viewportLabels = [
    { label: "Ich bin mobile (<640px)", className: "block sm:hidden" },
    {
      label: "Ich bin small (≥640px <768px)",
      className: "hidden sm:block md:hidden",
    },
    {
      label: "Ich bin medium (≥768px <1024px)",
      className: "hidden md:block lg:hidden",
    },
    {
      label: "Ich bin lg (≥1024px <1280px)",
      className: "hidden lg:block xl:hidden",
    },
    {
      label: "Ich bin xl (≥1280px)",
      className: "hidden xl:block 2xl:hidden",
    },
    {
      label: "Ich bin 2xl (≥1536px)",
      className: "hidden 2xl:block",
    },
  ];

  return (
    <div className="flex-1 flex flex-col w-full  items-center p-3 border-2 space-y-3 border-red-500 ">
      {heroChoice ? (
        <HeroBuilder
          className="rounded-lg"
          badge="Live now"
          heading="Build Better. Launch Faster."
          description="The all-in-one platform that helps teams ship faster."
          stats={[
            { number: 10000, label: "Happy Customers", suffix: "+" },
            { number: 500, label: "Projects Completed", suffix: "+" },
          ]}
          primaryImage="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          secondaryImages={{
            image1:
              "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
            image2:
              "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg",
          }}
          imageAlt="Team working"
          primaryButtonText="Start Building"
          secondaryButtonText="Watch Video"
          showLiveBadge={true}
        />
      ) : (
        <HeroCounter
          className="rounded-lg"
          badge="Trusted by industry leaders"
          heading="Transform Your Business with Proven Results"
          description="Join thousands of successful companies leveraging our platform."
          features={[
            "Enterprise-grade security",
            "24/7 dedicated support",
            "99.9% uptime guarantee",
            "Easy integration",
          ]}
          stats={[
            { number: 10000, label: "Happy Customers", suffix: "+" },
            { number: 500, label: "Projects Completed", suffix: "+" },
            { number: 99, label: "Success Rate", suffix: "%" },
            { number: 24, label: "Support Available", suffix: "/7" },
          ]}
          imageUrl="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
          imageAlt="Team collaboration"
          primaryButtonText="Get Started"
          secondaryButtonText="Watch Demo"
        />
      )}
      <div className="flex-1 border-2 border-blue-600 flex flex-col items-center xl:flex-row">
        {" "}
        <ProductFeatureProvider>
          <ImageGallery orientation="horizontal" />
        </ProductFeatureProvider>
      </div>
    </div>
  );
}

{
  /* <div className="flex flex-col w-full space-y-6">
      <div className="rounded-3xl overflow-hidden shadow-lg">
        {heroChoice ? (
          <HeroBuilder
            className="rounded-none"
            badge="Live now"
            heading="Build Better. Launch Faster."
            description="The all-in-one platform that helps teams ship faster."
            stats={[
              { number: 10000, label: "Happy Customers", suffix: "+" },
              { number: 500, label: "Projects Completed", suffix: "+" },
            ]}
            primaryImage="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
            secondaryImages={{
              image1:
                "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
              image2:
                "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg",
            }}
            imageAlt="Team working"
            primaryButtonText="Start Building"
            secondaryButtonText="Watch Video"
            showLiveBadge={true}
          />
        ) : (
          <HeroCounter
            className="rounded-none"
            badge="Trusted by industry leaders"
            heading="Transform Your Business with Proven Results"
            description="Join thousands of successful companies leveraging our platform."
            features={[
              "Enterprise-grade security",
              "24/7 dedicated support",
              "99.9% uptime guarantee",
              "Easy integration",
            ]}
            stats={[
              { number: 10000, label: "Happy Customers", suffix: "+" },
              { number: 500, label: "Projects Completed", suffix: "+" },
              { number: 99, label: "Success Rate", suffix: "%" },
              { number: 24, label: "Support Available", suffix: "/7" },
            ]}
            imageUrl="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
            imageAlt="Team collaboration"
            primaryButtonText="Get Started"
            secondaryButtonText="Watch Demo"
          />
        )}
      </div>
      <div className="flex justify-center ">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setHeroChoice(!heroChoice)}
        >
          MEIN TEXT
        </Button>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-lg">
        <div className="mx-auto flex flex-col max-w-5xl">
          <div className="mx-auto w-full max-w-5xl">
            <div className="border w-full aspect-video border-red-500">
              <ProductCard />
            </div>{" "}
          </div>
          <FeatureAccordion pages={featurePages} />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Orientierung: <strong>{carouselOrientation.toUpperCase()}</strong>
            </span>
            <div className="flex gap-2">
              <Button
                variant={
                  carouselOrientation === "horizontal" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setCarouselOrientation("horizontal")}
              >
                Horizontal
              </Button>
              <Button
                variant={
                  carouselOrientation === "vertical" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setCarouselOrientation("vertical")}
              >
                Vertikal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div> */
}
