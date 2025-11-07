import { motion } from "framer-motion";
import CountingNumber from "@/components/base/counting-number";
import { LogoPacon } from "@/components/base/logo";

import { ArrowRight, CheckCircle } from "lucide-react";

import { Button } from "@/components/base/button";
import { cn } from "@/shared/lib/utils";
export interface StatItem {
  number: number;
  label: string;
  suffix?: string;
}

export interface HeroCounterProps {
  badge?: string;
  heading: string;
  description: string;
  features: string[];
  stats: StatItem[];
  imageUrl: string;
  imageAlt?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

export function HeroCounter({
  badge = "Trusted by industry leaders",
  heading,
  description,
  features,
  stats,
  imageUrl,
  imageAlt = "Hero image",
  primaryButtonText = "Get Started",
  secondaryButtonText = "Watch Demo",
  onPrimaryClick,
  onSecondaryClick,
  className,
}: HeroCounterProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        ease: [0.42, 0, 0.58, 1] as const,
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
        ease: [0.42, 0, 0.58, 1] as const,
      },
    },
  };

  return (
    <div
      className={cn(
        "w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            className="space-y-6 lg:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-4">
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-2"
              >
                <LogoPacon size="md" className="hidden md:block h-10 w-auto" />
                <LogoPacon size="sm" className="block md:hidden h-8 w-auto" />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {badge}
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight"
              >
                {heading}
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {description}
              </motion.p>
            </div>

            <motion.ul
              variants={itemVariants}
              className="space-y-2.5 lg:space-y-3"
            >
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                >
                  <CheckCircle
                    className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0"
                  />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 lg:gap-4"
            >
              <Button
                onClick={onPrimaryClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                {primaryButtonText}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                onClick={onSecondaryClick}
                variant="outline"
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              >
                {secondaryButtonText}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Image with Stats Overlay */}
          <motion.div
            className="relative"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={imageVariants}
              className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-950 shadow-xl"
            >
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 right-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      <CountingNumber
                        number={stat.number}
                        className="inline-block"
                      />
                      {stat.suffix && <span>{stat.suffix}</span>}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
