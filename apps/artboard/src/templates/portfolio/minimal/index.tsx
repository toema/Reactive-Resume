import { cn } from "@reactive-resume/utils";
import { PortfolioTemplateProps } from "../types";
import { BaseTemplate } from "../base";
import { Hero } from "./components/hero";
import { About } from "./components/about";


export const MinimalTemplate: React.FC<PortfolioTemplateProps> = ({ data }) => {
   console.log("MinimalTemplate rendering with data:", data);
  
  if (!data) {
    console.error("MinimalTemplate: No data provided");
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No portfolio data available</p>
      </div>
    );
  }

  const { sections, metadata } = data;
  
  if (!sections || !metadata) {
    console.error("MinimalTemplate: Invalid data structure", { sections, metadata });
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Invalid portfolio data structure</p>
      </div>
    );
  }


  return (
    <BaseTemplate
      data={data}
      className="bg-background text-text"
    >
      {/* Hero Section */}
      <Hero
        name={data.basics.name}
        headline={data.basics.headline}
        picture={data.basics.picture}
        banner={data.basics.banner}
      />

       {/* Dynamic Sections */}
       {data.metadata.layout.sections.map((sectionId) => {
        const section = sections[sectionId];
        if (!section?.visible) return null;

        switch (sectionId) {
          case "about":
            return (
              <About
                key={sectionId}
                name={data.basics.name}
                headline={data.basics.headline}
                picture={data.basics.picture}
                banner={data.basics.banner}
              />
            );

          default:
            if (sectionId.startsWith("custom.")) {
              return (<></>

              );
            }
            return null;
        }
      })}
    </BaseTemplate>
  );
};
