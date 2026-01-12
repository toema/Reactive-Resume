import { Profile as ProfileType, SectionWithItem } from "@reactive-resume/schema";
import React from "react";

interface ProfilesProps {
    profiles: SectionWithItem<ProfileType>;
}

export const Profiles: React.FC<ProfilesProps> = ({ profiles }) => {
    if (!profiles.visible || profiles.items.length === 0) return null;

    return (
        <div className="flex justify-center gap-4 py-8">
            {profiles.items
                .filter((item) => item.visible)
                .map((item) => (
                    <a
                        key={item.id}
                        href={item.url.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title={item.username}
                    >
                        {/* Using simple text fallback if icon loading is complex, but consistent with Azurill we can try to use the icon url */}
                        {item.icon ? (
                            <img
                                src={`https://cdn.simpleicons.org/${item.icon}`}
                                alt={item.network}
                                className="w-6 h-6 grayscale hover:grayscale-0 transition-all"
                            />
                        ) : (
                            <span className="text-sm font-medium">{item.network}</span>
                        )}
                    </a>
                ))}
        </div>
    );
};
