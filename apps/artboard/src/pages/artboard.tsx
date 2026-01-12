/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/rules-of-hooks */
import { defaultMetadata, defaultPortfolioMetadata } from "@reactive-resume/schema";
import { useEffect, useMemo } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import webfontloader from "webfontloader";

import { useArtboardStore } from "../store/artboard";

export const ArtboardPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "resume";

  // Get data from store
  const resumeData = useArtboardStore((state) => state.resume);
  const portfolioData = useArtboardStore((state) => state.portfolio);

  // Get metadata with fallback to defaults and proper null checks
  const metadata = useMemo(() => {
    if (mode === "portfolio") {
      return portfolioData?.metadata ?? defaultPortfolioMetadata;
    }
    return resumeData?.metadata ?? defaultMetadata;
  }, [mode, portfolioData, resumeData]);

  // Create font string for Google Fonts
  const fontString = useMemo(() => {
    const family = metadata.typography.font.family;
    const variants = metadata.typography.font.variants.join(",");
    const subset = metadata.typography.font.subset;

    return `${family}:${variants}:${subset}`;
  }, [metadata.typography.font]);

  // Load fonts and notify parent when page is ready
  useEffect(() => {
    console.log("Loading fonts for artboard:", fontString);
    
    webfontloader.load({
      google: { families: [fontString] },
      active: () => {
        console.log("Fonts loaded successfully");
        const width = window.document.body.offsetWidth;
        const height = window.document.body.offsetHeight;
        const message = { 
          type: "PAGE_LOADED", 
          payload: { width, height },
          mode,
          timestamp: Date.now()
        };
        window.parent.postMessage(message, "*");
      },
      inactive: () => {
        console.warn("Fonts failed to load");
      }
    });
  }, [fontString, mode]);

  // Set up CSS variables and styles
  useEffect(() => {
    console.log("Setting up CSS variables for mode:", mode, "metadata:", metadata);
    
    // Font Size & Line Height
    document.documentElement.style.setProperty("font-size", `${metadata.typography.font.size}px`);
    document.documentElement.style.setProperty("line-height", `${metadata.typography.lineHeight}`);

    // Page margins and typography
    document.documentElement.style.setProperty("--margin", `${metadata.page.margin}px`);
    document.documentElement.style.setProperty("--font-size", `${metadata.typography.font.size}px`);
    document.documentElement.style.setProperty(
      "--line-height",
      `${metadata.typography.lineHeight}`,
    );

    // Theme colors
    document.documentElement.style.setProperty("--color-foreground", metadata.theme.text);
    document.documentElement.style.setProperty("--color-primary", metadata.theme.primary);
    document.documentElement.style.setProperty("--color-background", metadata.theme.background);
  }, [metadata]);

  // Typography Options
  useEffect(() => {
    // eslint-disable-next-line unicorn/prefer-spread
    const elements = Array.from(document.querySelectorAll(`[data-page]`));

    for (const el of elements) {
      el.classList.toggle("hide-icons", metadata.typography.hideIcons);
      el.classList.toggle("underline-links", metadata.typography.underlineLinks);
    }
  }, [metadata]);

  return <Outlet />;
};
