import { Experience as ExperienceType, SectionWithItem } from "@reactive-resume/schema";
import { cn } from "@reactive-resume/utils";
import React from "react";

interface ExperienceProps {
    section: SectionWithItem<ExperienceType>;
}

export const Experience: React.FC<ExperienceProps> = ({ section }) => {
    if (!section.visible || section.items.length === 0) return null;

    return (
        <section id={section.id} className="py-12 md:py-16 bg-secondary/10">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center text-primary">
                    {section.name}
                </h2>

                <div className="space-y-8 max-w-3xl mx-auto">
                    {section.items
                        .filter((item) => item.visible)
                        .map((item) => (
                            <div
                                key={item.id}
                                className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-full before:w-[2px] before:bg-primary/20 last:before:hidden"
                            >
                                <div className="absolute left-[-5px] top-2 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                    <h3 className="text-xl font-bold">{item.position}</h3>
                                    <div className="text-sm font-medium text-muted-foreground">
                                        {item.date}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-semibold text-lg text-primary/80">
                                        {item.url ? (
                                            <a href={item.url.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {item.company}
                                            </a>
                                        ) : (
                                            item.company
                                        )}
                                    </div>
                                    {item.location && (
                                        <div className="text-sm text-muted-foreground italic">
                                            {item.location}
                                        </div>
                                    )}
                                </div>

                                {item.summary && (
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: item.summary }}
                                    />
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};
