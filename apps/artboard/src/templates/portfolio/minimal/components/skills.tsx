import { Skill as SkillType, SectionWithItem } from "@reactive-resume/schema";
import { cn, linearTransform } from "@reactive-resume/utils";
import React from "react";

interface SkillsProps {
    section: SectionWithItem<SkillType>;
}

export const Skills: React.FC<SkillsProps> = ({ section }) => {
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
                            <div key={item.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">{item.name}</span>
                                    {item.level > 0 && (
                                        <span className="text-sm text-muted-foreground">{item.level}/5</span>
                                    )}
                                </div>
                                {item.description && (
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                )}

                                {item.level > 0 && (
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500 ease-out"
                                            style={{ width: `${linearTransform(item.level, 0, 5, 0, 100)}%` }}
                                        />
                                    </div>
                                )}

                                {item.keywords && item.keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {item.keywords.map(kw => (
                                            <span key={kw} className="text-[10px] uppercase px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                                                {kw}
                                            </span>
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
