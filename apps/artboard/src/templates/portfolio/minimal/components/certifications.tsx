import { Certification as CertificationType, SectionWithItem } from "@reactive-resume/schema";
import React from "react";

interface CertificationsProps {
    section: SectionWithItem<CertificationType>;
}

export const Certifications: React.FC<CertificationsProps> = ({ section }) => {
    if (!section.visible || section.items.length === 0) return null;

    return (
        <section id={section.id} className="py-12 md:py-16 bg-secondary/5">
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
                                className="flex items-start p-4 rounded-lg border bg-card text-card-foreground hover:shadow-sm"
                            >
                                <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74Z" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold">{item.name}</h3>
                                    <div className="text-sm text-primary mb-1">{item.issuer}</div>
                                    <div className="text-xs text-muted-foreground">{item.date}</div>
                                    {item.summary && (
                                        <div
                                            className="mt-2 text-sm text-muted-foreground"
                                            dangerouslySetInnerHTML={{ __html: item.summary }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};
