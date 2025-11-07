// External Libraries
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Components
import { Button } from "@/components/base/button";
import { Card, CardContent } from "@/components/base/card";

// Types
import type { Testimonial } from "@/shared/data/mock-testimonials";

// Hooks

// Translations

// Data Loading

// Early Returns

// Computed Data

// Event Handlers

// Effects

export interface TestimonialSliderProps {
  testimonials: Testimonial[];
  type: 'customer' | 'employee';
}

export function TestimonialSlider({ testimonials, type }: TestimonialSliderProps) {
  // Hooks
  const [currentIndex, setCurrentIndex] = useState(0);

  // Translations
  const { t } = useTranslation();

  // Data Loading

  // Early Returns
  const filteredTestimonials = testimonials
    .filter(testimonial => testimonial.type === type)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (filteredTestimonials.length === 0) {
    return null;
  }

  // Computed Data
  const currentTestimonial = filteredTestimonials[currentIndex];
  const totalSlides = filteredTestimonials.length;

  // Event Handlers
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Effects
  // Auto-advance slider every 8 seconds
  useEffect(() => {
    if (totalSlides > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [totalSlides, currentIndex]);

  return (
    <div className="space-y-6">
      <Card className="min-h-[200px]">
        <CardContent className="p-8">
          <blockquote className="text-lg leading-relaxed text-center mb-6">
            "{currentTestimonial.text}"
          </blockquote>
          {(currentTestimonial.author || currentTestimonial.authorFunction) && (
            <footer className="text-center">
              {currentTestimonial.author && (
                <cite className="font-semibold not-italic">{currentTestimonial.author}</cite>
              )}
              {currentTestimonial.authorFunction && (
                <p className="text-sm text-muted-foreground mt-1">
                  {currentTestimonial.authorFunction}
                </p>
              )}
            </footer>
          )}
        </CardContent>
      </Card>

      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            aria-label={t("testimonialSlider.previous")}
          >
            ←
          </Button>

          <div className="flex gap-2">
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`${t("testimonialSlider.goToSlide")} ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            aria-label={t("testimonialSlider.next")}
          >
            →
          </Button>
        </div>
      )}
    </div>
  );
}