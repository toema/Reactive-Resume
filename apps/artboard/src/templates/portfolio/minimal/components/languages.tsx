import { Language as LanguageType, SectionWithItem } from "@reactive-resume/schema";
import { linearTransform } from "@reactive-resume/utils";
import React from "react";

interface LanguagesProps {
    section: SectionWithItem<LanguageType>;
}

export const Languages: React.FC<LanguagesProps> = ({ section }) => {
    if (!section.visible || section.items.length === 0) return null;

    return (
        <section id={section.id} className="py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center text-primary">
                    {section.name}
                </h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                    {section.items
                        .filter((item) => item.visible)
                        .map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/10">
                                <div>
                                    <div className="font-bold">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">{item.description}</div>
                                </div>
                                {item.level > 0 && (
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div
                                                key={star}
                                                className={`h-2 w-2 rounded-full ${star <= item.level ? 'bg-primary' : 'bg-primary/20'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};
