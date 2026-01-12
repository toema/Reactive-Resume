import { cn } from "@reactive-resume/utils";
import { Picture } from "../../../../components/picture";

interface HeroProps {
  name: string;
  headline: string;
  picture: {
    url: string;
    size: number;
    aspectRatio: number;
    borderRadius: number;
    effects: {
      hidden: boolean;
      border: boolean;
      grayscale: boolean;
    };
  };
  banner: {
    url: string;
    effects: {
      hidden: boolean;
      grayscale: boolean;
      parallax: boolean;
    };
  };
}

export const Hero: React.FC<HeroProps> = ({
  name,
  headline,
  picture,
  banner,
}) => {
  return (
    <section className="relative min-h-screen">
      {/* Banner */}
      {!banner.effects.hidden && banner.url && (
        <div
          className={cn(
            "absolute inset-0 z-0",
            banner.effects.grayscale && "grayscale",
            banner.effects.parallax && "parallax"
          )}
          style={{
            backgroundImage: `url(${banner.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center">
          {/* Profile Picture */}
          {!picture.effects.hidden && picture.url && (
            <Picture
              url={picture.url}
              size={picture.size}
              aspectRatio={picture.aspectRatio}
              borderRadius={picture.borderRadius}
              effects={picture.effects}
              className="mx-auto mb-8 size-32 rounded-full"
            />
          )}

          {/* Name & Tagline */}
          <h1 className="mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            {name}
          </h1>
          <h1 className="text-xl font-medium opacity-75 sm:text-2xl">{headline}</h1>
        </div>
      </div>
    </section>
  );
};
