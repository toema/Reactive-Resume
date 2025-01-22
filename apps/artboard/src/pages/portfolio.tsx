import { PortfolioSections } from "@reactive-resume/schema";

import { PortfolioLayout } from "../components/portfolio-layout";
import { PortfolioSection as PortfolioSectionComponent } from "../components/portfolio-section";
import { useArtboardStore } from "../store/artboard";

export const PortfolioPage: React.FC = () => {
  const portfolio = useArtboardStore((state) => state.portfolio);
  const layout = portfolio.metadata.layout;

  const renderSection = (sectionKey: keyof PortfolioSections) => {
    const section = portfolio.sections[sectionKey] as IPortfolioSection;
    if (!section.visible) return null;

    return (
      <PortfolioSectionComponent key={sectionKey} section={section}>
        <PortfolioLayout
          type={section.fullWidth ? "fullwidth" : layout.type}
          className="animate-in fade-in-50"
        >
          {/* Section specific rendering logic will go here */}
          {section.items &&
            "items" in section &&
            section.items.map((item, index) => <div key={index}>{/* Item rendering logic */}</div>)}
        </PortfolioLayout>
      </PortfolioSectionComponent>
    );
  };

  return (
    <div className="min-h-screen">
      <main>
        {layout.sections.map((sectionKey) => renderSection(sectionKey as keyof PortfolioSections))}
      </main>
    </div>
  );
};
