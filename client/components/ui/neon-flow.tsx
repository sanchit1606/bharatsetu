"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Helper for light/pastel random colors (keeps the effect "light mode")
const randomPastelColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => {
      const r = Math.floor(180 + Math.random() * 75);
      const g = Math.floor(180 + Math.random() * 75);
      const b = Math.floor(180 + Math.random() * 75);
      return (
        "#" +
        [r, g, b]
          .map((v) => v.toString(16).padStart(2, "0"))
          .join("")
      );
    });
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({
  children,
  className,
  enableClickInteraction = true,
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // Vite: prevent bundling/analysis of the CDN module
        // @ts-ignore
        const module = await import(
          /* @vite-ignore */
          "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
        );
        const TubesCursor = (module as any).default;
        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            // Softer, light-friendly palette
            colors: ["#a78bfa", "#93c5fd", "#f9a8d4"],
            lights: {
              // Lower intensity so the effect doesn't overpower on light backgrounds
              intensity: 90,
              colors: ["#bbf7d0", "#fed7aa", "#fbcfe8", "#bae6fd"],
            },
          },
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {
          // library likely handles resize internally
        };
        window.addEventListener("resize", handleResize);

        cleanup = () => {
          window.removeEventListener("resize", handleResize);
          tubesRef.current = null;
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;

    const colors = randomPastelColors(3);
    const lightsColors = randomPastelColors(4);

    tubesRef.current.tubes.setColors(colors);
    tubesRef.current.tubes.setLightsColors(lightsColors);
  };

  return (
    <div
      className={cn(
        // Light mode background
        "relative w-full overflow-hidden bg-zinc-50",
        // keep a sensible minimum so the effect is visible
        "min-h-[380px]",
        className
      )}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block opacity-90"
        style={{ touchAction: "none" }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* Subtle fade-in once loaded (optional) */}
      {!isLoaded ? (
        <motion.div
          className="absolute inset-0 bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ) : null}
    </div>
  );
}

export default TubesBackground;


