import { Interest as InterestType, SectionWithItem } from "@reactive-resume/schema";
import React from "react";

interface InterestsProps {
    section: SectionWithItem<InterestType>;
}

export const Interests: React.FC<InterestsProps> = ({ section }) => {
    if (!section.visible || section.items.length === 0) return null;

    return (
        <section id={section.id} className="py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center text-primary">
                    {section.name}
                </h2>

                <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                    {section.items
                        .filter((item) => item.visible)
                        .map((item) => (
                            <div
                                key={item.id}
                                className="px-4 py-2 rounded-full border border-primary/20 bg-background text-foreground hover:bg-primary/5 transition-colors"
                            >
                                <div className="font-medium">{item.name}</div>
                                {item.keywords && item.keywords.length > 0 && (
                                    <div className="text-xs text-muted-foreground mt-1 text-center">
                                        {item.keywords.join(", ")}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};
