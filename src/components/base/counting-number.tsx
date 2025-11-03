import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

interface CountingNumberProps {
  number: number;
  duration?: number;
  className?: string;
}

export default function CountingNumber({
  number,
  duration = 2000,
  className,
}: CountingNumberProps) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
    setCount(0);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTimeRef.current) / duration,
        1
      );

      // Easing function für smoothere Animation (ease-out)
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOutQuad * number);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(number);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [number, duration]);

  return <span className={cn(className)}>{count}</span>;
}
