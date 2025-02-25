/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable lingui/no-unlocalized-strings */
import { t } from "@lingui/macro";
import { Button, Combobox, ComboboxOption, Label, Slider, Switch } from "@reactive-resume/ui";
import { cn, fonts } from "@reactive-resume/utils";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import webfontloader from "webfontloader";

import { usePortfolioStore } from "@/client/stores/portfolio";
import { useResumeStore } from "@/client/stores/resume";

import { getSectionIcon } from "../shared/section-icon";

const fontSuggestions = [
  "Open Sans",
  "Merriweather",
  "Roboto Condensed",
  "Playfair Display",
  "Lato",
  "Lora",
  "PT Sans",
  "PT Serif",
  "IBM Plex Sans",
  "IBM Plex Serif",
];

const families: ComboboxOption[] = fonts.map((font) => ({
  value: font.family,
  label: font.family,
}));

export const TypographySection = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "resume";

  const [subsets, setSubsets] = useState<ComboboxOption[]>([]);
  const [variants, setVariants] = useState<ComboboxOption[]>([]);

  // Use the appropriate store based on mode
  const setValue = mode === "portfolio"
    ? usePortfolioStore((state) => state.setValue)
    : useResumeStore((state) => state.setValue);

  const typography = mode === "portfolio"
    ? usePortfolioStore((state) => state.portfolio?.data?.metadata?.typography)
    : useResumeStore((state) => state.resume?.data?.metadata?.typography);

  // If typography settings aren't loaded yet, return null or loading state
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!typography) {
    return null; // or return <LoadingSpinner />
  }

  const loadFontSuggestions = useCallback(() => {
    for (const font of fontSuggestions) {
      webfontloader.load({
        events: false,
        classes: false,
        google: { families: [font], text: font },
      });
    }
  }, [fontSuggestions]);

  useEffect(() => {
    loadFontSuggestions();
  }, []);

  useEffect(() => {
    const subsets = fonts.find((font) => font.family === typography.font.family)?.subsets ?? [];
    setSubsets(subsets.map((subset) => ({ value: subset, label: subset })));

    const variants = fonts.find((font) => font.family === typography.font.family)?.variants ?? [];
    setVariants(variants.map((variant) => ({ value: variant, label: variant })));
  }, [typography.font.family]);

  return (
    <section id="typography" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("typography")}
          <h2 className="line-clamp-1 text-3xl font-bold">{t`Typography`}</h2>
        </div>
      </header>

      <main className="grid gap-y-4">
        <div className="grid grid-cols-2 gap-4">
          {fontSuggestions.map((font) => (
            <Button
              key={font}
              variant="outline"
              style={{ fontFamily: font }}
              disabled={typography.font.family === font}
              className={cn(
                "flex h-12 items-center justify-center overflow-hidden rounded border text-center text-sm ring-primary transition-colors hover:bg-secondary-accent focus:outline-none focus:ring-1 disabled:opacity-100",
                typography.font.family === font && "ring-1",
              )}
              onClick={() => {
                setValue("metadata.typography.font.family", font);
                setValue("metadata.typography.font.subset", "latin");
                setValue("metadata.typography.font.variants", ["regular"]);
              }}
            >
              {font}
            </Button>
          ))}
        </div>

        <div className="space-y-1.5">
          <Label>{t`Font Family`}</Label>
          <Combobox
            options={families}
            value={typography.font.family}
            searchPlaceholder={t`Search for a font family`}
            onValueChange={(value) => {
              setValue("metadata.typography.font.family", value);
              setValue("metadata.typography.font.subset", "latin");
              setValue("metadata.typography.font.variants", ["regular"]);
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-1.5">
            <Label>{t`Font Subset`}</Label>
            <Combobox
              options={subsets}
              value={typography.font.subset}
              searchPlaceholder={t`Search for a font subset`}
              onValueChange={(value) => {
                setValue("metadata.typography.font.subset", value);
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t`Font Variants`}</Label>
            <Combobox
              multiple
              options={variants}
              value={typography.font.variants}
              searchPlaceholder={t`Search for a font variant`}
              onValueChange={(value) => {
                setValue("metadata.typography.font.variants", value);
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>{t`Font Size`}</Label>
          <div className="flex items-center gap-x-4 py-1">
            <Slider
              min={12}
              max={18}
              step={0.05}
              value={[typography.font.size]}
              onValueChange={(value) => {
                setValue("metadata.typography.font.size", value[0]);
              }}
            />

            <span className="text-base font-bold">{typography.font.size}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>{t`Line Height`}</Label>
          <div className="flex items-center gap-x-4 py-1">
            <Slider
              min={0}
              max={3}
              step={0.05}
              value={[typography.lineHeight]}
              onValueChange={(value) => {
                setValue("metadata.typography.lineHeight", value[0]);
              }}
            />

            <span className="text-base font-bold">{typography.lineHeight}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>{t`Options`}</Label>

          <div className="flex items-center gap-x-4 py-2">
            <Switch
              id="metadata.typography.hideIcons"
              checked={typography.hideIcons}
              onCheckedChange={(checked) => {
                setValue("metadata.typography.hideIcons", checked);
              }}
            />
            <Label htmlFor="metadata.typography.hideIcons">{t`Hide Icons`}</Label>
          </div>

          <div className="flex items-center gap-x-4 py-2">
            <Switch
              id="metadata.typography.underlineLinks"
              checked={typography.underlineLinks}
              onCheckedChange={(checked) => {
                setValue("metadata.typography.underlineLinks", checked);
              }}
            />
            <Label htmlFor="metadata.typography.underlineLinks">{t`Underline Links`}</Label>
          </div>
        </div>
      </main>
    </section>
  );
};
