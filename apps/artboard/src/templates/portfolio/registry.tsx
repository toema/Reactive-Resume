import { PortfolioTemplateProps } from "./types";
import { MinimalTemplate } from "./minimal";

export const portfolioTemplates: Record<string, React.ComponentType<PortfolioTemplateProps>> = {
  minimal: MinimalTemplate,
};

export const getPortfolioTemplate = (id: string): React.ComponentType<PortfolioTemplateProps> | null => {
  console.log("Getting portfolio template for:", id);
  
  if (!id) {
    console.warn("No template ID provided, using minimal as fallback");
    return MinimalTemplate;
  }
  
  const template = portfolioTemplates[id];
  if (!template) {
    console.error("Portfolio template not found:", id, "Available templates:", Object.keys(portfolioTemplates));
    return MinimalTemplate; // fallback to minimal
  }
  
  console.log("Found portfolio template:", id);
  return template;
};
