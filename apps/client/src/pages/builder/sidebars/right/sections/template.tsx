/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/rules-of-hooks */
import { t } from "@lingui/macro";
import { AspectRatio } from "@reactive-resume/ui";
import { cn, templatesList } from "@reactive-resume/utils";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import { usePortfolioStore } from "@/client/stores/portfolio";
import { useResumeStore } from "@/client/stores/resume";

import { getSectionIcon } from "../shared/section-icon";

export const TemplateSection = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "resume";

  // Use the appropriate store based on mode
  const setValue =
    mode === "portfolio"
      ? usePortfolioStore((state) => state.setValue)
      : useResumeStore((state) => state.setValue);

  const currentTemplate =
    mode === "portfolio"
      ? usePortfolioStore((state) => state.portfolio?.data?.metadata?.template)
      : useResumeStore((state) => state.resume?.data?.metadata?.template);

  // If template settings aren't loaded yet, return null or loading state
  if (!currentTemplate) {
    return null;
  }

  return (
    <section id="template" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("template")}
          <h2 className="line-clamp-1 text-3xl font-bold">{t`Template`}</h2>
        </div>
      </header>

      <main className="grid grid-cols-2 gap-5 @lg/right:grid-cols-3 @2xl/right:grid-cols-4">
        {templatesList.map((template, index) => (
          <AspectRatio key={template} ratio={1 / 1.4142}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: index * 0.1 } }}
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              className={cn(
                "relative cursor-pointer rounded-sm ring-primary transition-all hover:ring-2",
                currentTemplate === template && "ring-2",
              )}
              onClick={() => {
                setValue("metadata.template", template);
              }}
            >
              <img src={`/templates/jpg/${template}.jpg`} alt={template} className="rounded-sm" />

              <div className="absolute inset-x-0 bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-background/80">
                <p className="absolute inset-x-0 bottom-2 text-center font-bold capitalize text-primary">
                  {template}
                </p>
              </div>
            </motion.div>
          </AspectRatio>
        ))}
      </main>
    </section>
  );
};
