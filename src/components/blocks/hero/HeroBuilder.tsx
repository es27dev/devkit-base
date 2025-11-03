import React from "react";
import { motion } from "framer-motion";
import CountingNumber from "@/components/base/counting-number";
import { LogoPacon } from "@/components/base/logo";

import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/base/button";
import { cn } from "@/shared/lib/utils";

export interface StatItem {
  number: number;
  label: string;
  suffix?: string;
}

export interface HeroBuilderProps {
  badge?: string;
  heading: string;
  description: string;
  stats: StatItem[];
  primaryImage: string;
  secondaryImages?: {
    image1: string;
    image2: string;
  };
  imageAlt?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  showLiveBadge?: boolean;
  className?: string;
}

export function HeroBuilder({
  heading,
  description,
  stats,
  primaryImage,
  secondaryImages,
  imageAlt = "Hero image",
  primaryButtonText = "Start Building",
  secondaryButtonText = "Watch Video",
  onPrimaryClick,
  onSecondaryClick,

  className,
}: HeroBuilderProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className={cn(
        "w-full bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            className="lg:col-span-3 space-y-6 lg:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-2 items-start"
              >
                <LogoPacon size="md" className="hidden md:block h-10 w-auto" />
                <LogoPacon size="sm" className="block md:hidden h-8 w-auto" />
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 leading-tight"
              >
                {heading}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl"
              >
                {description}
              </motion.p>
            </div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 lg:gap-4"
            >
              <Button
                onClick={onPrimaryClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
              >
                {primaryButtonText}
                <ArrowRight weight="bold" className="w-5 h-5" />
              </Button>
              <Button
                onClick={onSecondaryClick}
                variant="outline"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
              >
                <Play weight="fill" className="w-5 h-5" />
                {secondaryButtonText}
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 pt-6 lg:pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    <CountingNumber
                      number={stat.number}
                      className="inline-block"
                    />
                    {stat.suffix && (
                      <span className="text-blue-600 dark:text-blue-400">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Images */}
          <motion.div
            className="lg:col-span-2 space-y-3 lg:space-y-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={imageVariants}
              className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <img
                src={primaryImage}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {secondaryImages && (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={secondaryImages.image1}
                    alt="Detail 1"
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={secondaryImages.image2}
                    alt="Detail 2"
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
