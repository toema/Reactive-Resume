import { Award as AwardType, SectionWithItem } from "@reactive-resume/schema";
import { cn } from "@reactive-resume/utils";
import React from "react";

interface AwardsProps {
    section: SectionWithItem<AwardType>;
}

export const Awards: React.FC<AwardsProps> = ({ section }) => {
    if (!section.visible || section.items.length === 0) return null;

    return (
        <section id={section.id} className="py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center text-primary">
                    {section.name}
                </h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                    {section.items
                        .filter((item) => item.visible)
                        .map((item) => (
                            <div
                                key={item.id}
                                className="bg-card text-card-foreground rounded-lg border shadow-sm p-6 text-center hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10 text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                <div className="text-sm font-medium text-primary mb-2">{item.awarder}</div>
                                <div className="text-xs text-muted-foreground mb-3">{item.date}</div>

                                {item.summary && (
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none text-sm text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: item.summary }}
                                    />
                                )}
                                {item.url && (
                                    <a href={item.url.href} target="_blank" rel="noopener noreferrer" className="mt-3 text-xs text-primary hover:underline inline-block">
                                        View Award
                                    </a>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};
