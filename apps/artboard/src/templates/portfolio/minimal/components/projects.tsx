import { Project as ProjectType, SectionWithItem } from "@reactive-resume/schema";
import { cn } from "@reactive-resume/utils";
import React from "react";

interface ProjectsProps {
    section: SectionWithItem<ProjectType>;
}

export const Projects: React.FC<ProjectsProps> = ({ section }) => {
    if (!section.visible || section.items.length === 0) return null;

    return (
        <section id={section.id} className="py-12 md:py-16 bg-secondary/10">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center text-primary">
                    {section.name}
                </h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {section.items
                        .filter((item) => item.visible)
                        .map((item) => (
                            <div
                                key={item.id}
                                className="group relative flex flex-col bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                                            {item.name}
                                        </h3>
                                    </div>

                                    <div className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                                        {item.date}
                                    </div>

                                    <div className="flex-1">
                                        <div className="mb-2 font-medium text-sm text-primary/80 line-clamp-2">
                                            {item.description}
                                        </div>
                                        {item.summary && (
                                            <div
                                                className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground line-clamp-3 text-sm"
                                                dangerouslySetInnerHTML={{ __html: item.summary }}
                                            />
                                        )}
                                    </div>

                                    {item.keywords && item.keywords.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {item.keywords.map((keyword) => (
                                                <span
                                                    key={keyword}
                                                    className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground font-medium"
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {item.url && (
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <a
                                                href={item.url.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                            >
                                                View Project
                                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};
