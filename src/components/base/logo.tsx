import { cn } from "@/utils";
export const Logo = () => (
  <svg width="124" height="32">
    ...
  </svg>
);

type LogoVariant = "lg" | "md" | "sm";

interface LogoProps {
  size?: LogoVariant;
  className?: string;
}

export const LogoPacon = ({ size = "lg", className }: LogoProps) => {
  const logos = {
    lg: { src: "/paconLarge.svg", alt: "Pacon Logo" },
    md: { src: "/paconMedium.svg", alt: "Pacon Logo" },
    sm: { src: "/paconSmall.svg", alt: "Pacon Logo" },
  };

  const { src, alt } = logos[size];

  return (
    <img
      src={src}
      alt={alt}
      className={cn(className, size === "md" && "mt-2")}
    />
  );
};
