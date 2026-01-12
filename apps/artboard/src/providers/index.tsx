import { defaultPortfolioData, defaultResumeData } from "@reactive-resume/schema";
import { useEffect } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import { useArtboardStore } from "../store/artboard";
import { MinimalTemplate } from "../templates/portfolio/minimal/index";

export const Providers = () => {
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get("mode") ?? "resume") as "resume" | "portfolio";

  const setResume = useArtboardStore((state) => state.setResume);
  const setPortfolio = useArtboardStore((state) => state.setPortfolio);
  const setMode = useArtboardStore((state) => state.setMode);

  useEffect(() => {
    console.log("Providers: Setting mode to", mode);
    setMode(mode);

    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from same origin for security
      if (event.origin !== window.location.origin) return;

      console.log("Artboard received message:", event.data);

      switch (event.data.type) {
        case "SET_RESUME": {
          const resumeData = event.data.payload || defaultResumeData;
          console.log("Setting resume data:", resumeData);
          setResume(resumeData);
          break;
        }
        case "SET_PORTFOLIO": {
          const portfolioData = event.data.payload || defaultPortfolioData;
          console.log("Setting portfolio data:", portfolioData);
          setPortfolio(portfolioData);
          break;
        }
        case "SET_THEME": {
          event.data.payload === "dark"
            ? document.documentElement.classList.add("dark")
            : document.documentElement.classList.remove("dark");
          break;
        }
      }
    };

    // Initialize with schema defaults
    if (mode === "portfolio") {
      console.log("Initializing with default portfolio data");
      setPortfolio(defaultPortfolioData);
    } else {
      console.log("Initializing with default resume data");
      setResume(defaultResumeData);
    }

    window.addEventListener("message", handleMessage);
    
    // Send ready message to parent
    window.parent.postMessage({ type: "ARTBOARD_READY", mode }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [mode, setMode, setResume, setPortfolio]);

  return <Outlet />;
};
