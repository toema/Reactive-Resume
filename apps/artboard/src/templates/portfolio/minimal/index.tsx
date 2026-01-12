import { cn } from "@reactive-resume/utils";
import { PortfolioTemplateProps } from "../types";
import { BaseTemplate } from "../base";
import { Hero } from "./components/hero";
import { About } from "./components/about";
import { Experience } from "./components/experience";
import { Education } from "./components/education";
import { Projects } from "./components/projects";
import { Skills } from "./components/skills";
import { Volunteer } from "./components/volunteer";
import { Awards } from "./components/awards";
import { Certifications } from "./components/certifications";
import { Interests } from "./components/interests";
import { Languages } from "./components/languages";
import { Profiles } from "./components/profiles";
import { SectionWithItem, Experience as ExperienceType, Education as EducationType, Project as ProjectType, Skill as SkillType, Volunteer as VolunteerType, Award as AwardType, Certification as CertificationType, Interest as InterestType, Language as LanguageType, Profile as ProfileType } from "@reactive-resume/schema";

export const MinimalTemplate: React.FC<PortfolioTemplateProps> = ({ data }) => {
  if (!data) return null;

  const { sections, metadata, basics } = data;

  if (!sections || !metadata) return null;

  return (
    <BaseTemplate
      data={data}
      className="bg-background text-foreground animate-in fade-in duration-500"
    >
      {/* Hero Section */}
      <Hero
        name={basics.name}
        headline={basics.headline}
        picture={basics.picture}
        banner={basics.banner}
      />

      {/* Social Profiles - Rendered after Hero */}
      {sections.profiles && sections.profiles.visible && (
        <div className="container mx-auto px-4 -mt-8 mb-12 relative z-20">
          <Profiles profiles={sections.profiles as SectionWithItem<ProfileType>} />
        </div>
      )}

      {/* Dynamic Sections */}
      <div className="space-y-4">
        {metadata.layout.sections.map((sectionId) => {
          const section = sections[sectionId];
          if (!section?.visible) return null;

          switch (sectionId) {
            case "about":
              return (
                <About
                  key={sectionId}
                  name={basics.name}
                  headline={basics.headline}
                  picture={basics.picture}
                  banner={basics.banner}
                />
              );
            case "summary":
              return (
                <section key={sectionId} className="container mx-auto px-4 md:px-6 py-12 text-center max-w-4xl">
                  <h2 className="text-2xl font-bold mb-4 text-primary">{section.name}</h2>
                  <div
                    className="prose prose-lg dark:prose-invert mx-auto"
                    dangerouslySetInnerHTML={{ __html: section.content || "" }}
                  />
                </section>
              );
            case "experience":
              return <Experience key={sectionId} section={section as SectionWithItem<ExperienceType>} />;
            case "education":
              return <Education key={sectionId} section={section as SectionWithItem<EducationType>} />;
            case "projects":
              return <Projects key={sectionId} section={section as SectionWithItem<ProjectType>} />;
            case "skills":
              return <Skills key={sectionId} section={section as SectionWithItem<SkillType>} />;
            case "volunteer":
              return <Volunteer key={sectionId} section={section as SectionWithItem<VolunteerType>} />;
            case "awards":
              return <Awards key={sectionId} section={section as SectionWithItem<AwardType>} />;
            case "certifications":
              return <Certifications key={sectionId} section={section as SectionWithItem<CertificationType>} />;
            case "interests":
              return <Interests key={sectionId} section={section as SectionWithItem<InterestType>} />;
            case "languages":
              return <Languages key={sectionId} section={section as SectionWithItem<LanguageType>} />;
            default:
              return null;
          }
        })}
      </div>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t mt-12 bg-secondary/5">
        <p>&copy; {new Date().getFullYear()} {basics.name}. All rights reserved.</p>
      </footer>
    </BaseTemplate>
  );
};
