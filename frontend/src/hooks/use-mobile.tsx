import * as React from "react";

// Breakpoint values matching tailwind.config.ts
const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  desktop: 1366,
  "2xl": 1536,
  "3xl": 1920,
} as const;

const MOBILE_BREAKPOINT = BREAKPOINTS.md; // 768px

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// Additional hook for more granular breakpoint detection
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<keyof typeof BREAKPOINTS | "base">("base");

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS["3xl"]) {
        setBreakpoint("3xl");
      } else if (width >= BREAKPOINTS["2xl"]) {
        setBreakpoint("2xl");
      } else if (width >= BREAKPOINTS.desktop) {
        setBreakpoint("desktop");
      } else if (width >= BREAKPOINTS.xl) {
        setBreakpoint("xl");
      } else if (width >= BREAKPOINTS.lg) {
        setBreakpoint("lg");
      } else if (width >= BREAKPOINTS.md) {
        setBreakpoint("md");
      } else if (width >= BREAKPOINTS.sm) {
        setBreakpoint("sm");
      } else if (width >= BREAKPOINTS.xs) {
        setBreakpoint("xs");
      } else {
        setBreakpoint("base");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isXs: breakpoint === "xs" || breakpoint === "base",
    isSm: breakpoint === "sm",
    isMd: breakpoint === "md",
    isLg: breakpoint === "lg",
    isXl: breakpoint === "xl",
    isDesktop: breakpoint === "desktop",
    is2xl: breakpoint === "2xl",
    is3xl: breakpoint === "3xl",
    // Convenience methods
    isMobile: ["base", "xs", "sm"].includes(breakpoint),
    isTablet: breakpoint === "md",
    isLaptop: ["lg", "xl"].includes(breakpoint),
    isDesktopOrLarger: ["desktop", "2xl", "3xl"].includes(breakpoint),
  };
}

// Hook for checking if screen is at least a certain breakpoint
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// Convenience hooks for common breakpoints
export function useIsNarrowPhone() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.xs - 1}px)`);
}

export function useIsTablet() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
}

export function useIsLaptop() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`);
}

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);
}

export function useIs4K() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS["3xl"]}px)`);
}
