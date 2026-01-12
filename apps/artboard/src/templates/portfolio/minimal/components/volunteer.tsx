import { Volunteer as VolunteerType, SectionWithItem } from "@reactive-resume/schema";
import { cn } from "@reactive-resume/utils";
import React from "react";

interface VolunteerProps {
    section: SectionWithItem<VolunteerType>;
}

export const Volunteer: React.FC<VolunteerProps> = ({ section }) => {
    if (!section.visible || section.items.length === 0) return null;

    return (
        <section id={section.id} className="py-12 md:py-16 bg-secondary/5">
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
                                className="relative pl-8 border-l-2 border-primary/20 hover:border-primary transition-colors duration-300"
                            >
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-background border-2 border-primary" />

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                                    <h3 className="text-xl font-bold">{item.organization}</h3>
                                    <div className="text-sm font-medium text-muted-foreground">
                                        {item.date}
                                    </div>
                                </div>

                                <div className="mb-2 text-lg font-medium text-primary/80">
                                    {item.position}
                                </div>
                                {item.location && <div className="text-sm text-muted-foreground mb-2">{item.location}</div>}

                                {item.summary && (
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: item.summary }}
                                    />
                                )}
                                {item.url && (
                                    <a href={item.url.href} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm text-primary hover:underline inline-block">
                                        Visit Organization
                                    </a>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};
