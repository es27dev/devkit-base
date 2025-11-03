// React Core
import { useMemo, useState } from "react";

// External Libraries
import { useTranslation } from "react-i18next";

// Base Components
import { Button } from "@/components/base/button";

// Feature Components
import { HeroBuilder } from "@/components/blocks/hero/HeroBuilder";
import { HeroCounter } from "@/components/blocks/hero/HeroCounter";
import { FeatureAccordion } from "@/components/blocks/productFeature/FeatureAccordion";
import { ProductShowcase } from "@/components/features/product-feature/product-feature";

export default function Home() {
  // 1. Hooks
  const { t } = useTranslation();
  const [heroChoice, setHeroChoice] = useState(false);

  // 2. Data Loading
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

  // 6. Render
  return (
    <div className="flex-1 flex flex-col w-full items-center p-6 space-y-8">
      {/* Demo Text Block from Sales Page Translation */}
      <div className="w-full max-w-4xl space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">{t("sales.hero.title")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("sales.hero.subtitle")}
          </p>
          <p className="text-lg">{t("sales.hero.description")}</p>
        </div>

        <div className="bg-card p-6 rounded-lg border space-y-3">
          <h2 className="text-2xl font-semibold">
            {t("sales.intro.headline")}
          </h2>
          {(t("sales.intro.text", { returnObjects: true }) as string[]).map(
            (paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            )
          )}
        </div>
      </div>

      {/* ProductShowcase Component with its own translations */}
      <ProductShowcase />
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
