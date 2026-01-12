import { PortfolioData, ResumeData, defaultPortfolioData, defaultResumeData } from "@reactive-resume/schema";
import { create } from "zustand";

type ArtboardStore = {
  mode: "resume" | "portfolio";
  resume: ResumeData;
  portfolio: PortfolioData;
  setMode: (mode: "resume" | "portfolio") => void;
  setResume: (resume: ResumeData) => void;
  setPortfolio: (portfolio: PortfolioData) => void;
};

export const useArtboardStore = create<ArtboardStore>()((set, get) => ({
  mode: "resume",
  resume: defaultResumeData,
  portfolio: defaultPortfolioData,
  setMode: (mode) => {
    console.log("Artboard: Setting mode to", mode);
    set({ mode });
  },
  setResume: (resume) => {
    console.log("Artboard: Setting resume data", resume);
    set({ resume });
  },
  setPortfolio: (portfolio) => {
    console.log("Artboard: Setting portfolio data", portfolio);
    set({ portfolio });
  },
}));
