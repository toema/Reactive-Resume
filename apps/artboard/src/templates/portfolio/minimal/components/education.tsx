import { Education as EducationType, SectionWithItem } from "@reactive-resume/schema";
import { cn } from "@reactive-resume/utils";
import React from "react";

interface EducationProps {
    section: SectionWithItem<EducationType>;
}

export const Education: React.FC<EducationProps> = ({ section }) => {
    if (!section.visible || section.items.length === 0) return null;

    return (
        <section id={section.id} className="py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center text-primary">
                    {section.name}
                </h2>

                <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                    {section.items
                        .filter((item) => item.visible)
                        .map((item) => (
                            <div
                                key={item.id}
                                className="bg-card text-card-foreground rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl">{item.institution}</h3>
                                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-2">{item.date}</span>
                                </div>

                                <div className="flex flex-col gap-1 mb-3">
                                    <div className="font-semibold text-primary">{item.area}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.studyType}
                                        {item.score && <span className="ml-2">• GPA: {item.score}</span>}
                                    </div>
                                </div>

                                {item.summary && (
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none text-sm text-muted-foreground"
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
