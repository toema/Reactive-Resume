/* eslint-disable react-hooks/rules-of-hooks */
import { SectionKey } from "@reactive-resume/schema";
import { PortfolioTemplate, Template } from "@reactive-resume/utils";
import { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Page } from "../components/page";
import { useArtboardStore } from "../store/artboard";
import { getTemplate } from "../templates";
import { getPortfolioTemplate } from "../templates/portfolio/registry";
import { PortfolioTemplateProps } from "../templates/portfolio/types";
import { TemplateProps } from "../types/template";

export const PreviewLayout = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "resume";

  // Get data from store
  const resumeData = useArtboardStore((state) => state.resume);
  const portfolioData = useArtboardStore((state) => state.portfolio);

  // Debug logging
  useEffect(() => {
    console.log("PreviewLayout - Mode:", mode);
    console.log("PreviewLayout - Resume data:", resumeData);
    console.log("PreviewLayout - Portfolio data:", portfolioData);
  }, [mode, resumeData, portfolioData]);

  // Get layout and template based on mode with proper null checks
  const layout = useMemo(() => {
    if (mode === "portfolio") {
      return portfolioData?.metadata?.layout?.sections || [];
    }
    return resumeData?.metadata?.layout || [];
  }, [mode, portfolioData, resumeData]);

  const template = useMemo(() => {
    if (mode === "portfolio") {
      return portfolioData?.metadata?.template as PortfolioTemplate;
    }
    return resumeData?.metadata?.template as Template;
  }, [mode, portfolioData, resumeData]);

  console.log("PreviewLayout - Layout:", layout);
  console.log("PreviewLayout - Template:", template);

  const TemplateComponent = useMemo(() => {
    if (mode === "portfolio") {
      const component = getPortfolioTemplate(template as string);
      console.log("Portfolio template component:", component);
      return component;
    }
    return getTemplate(template as Template);
  }, [template, mode]);

  // Portfolio Preview
  if (mode === "portfolio") {
    if (!portfolioData) {
      console.log("No portfolio data available");
      return (
        <Page mode="preview" pageNumber={1}>
          <div className="flex items-center justify-center h-64">
            <p>Loading portfolio...</p>
          </div>
        </Page>
      );
    }

    if (!TemplateComponent) {
      console.error("Portfolio template not found:", template);
      return (
        <Page mode="preview" pageNumber={1}>
          <div className="flex items-center justify-center h-64">
            <p>Portfolio template "{template}" not found</p>
          </div>
        </Page>
      );
    }

    const PortfolioTemplate = TemplateComponent as React.ComponentType<PortfolioTemplateProps>;
    
    return (
      <Page mode="preview" pageNumber={1}>
        <PortfolioTemplate data={portfolioData} />
      </Page>
    );
  }

  // Resume mode
  if (!resumeData) {
    console.log("No resume data available");
    return (
      <Page mode="preview" pageNumber={1}>
        <div className="flex items-center justify-center h-64">
          <p>Loading resume...</p>
        </div>
      </Page>
    );
  }

  if (!TemplateComponent) {
    console.error("Resume template not found:", template);
    return (
      <Page mode="preview" pageNumber={1}>
        <div className="flex items-center justify-center h-64">
          <p>Resume template "{template}" not found</p>
        </div>
      </Page>
    );
  }

  const ResumeTemplate = TemplateComponent as React.ComponentType<TemplateProps>;
  
  return (
    <>
      {layout.map((columns, pageIndex: number) => (
        <Page key={pageIndex} mode="preview" pageNumber={pageIndex + 1}>
          <ResumeTemplate isFirstPage={pageIndex === 0} columns={columns as SectionKey[][]} />
        </Page>
      ))}
    </>
  );
};
