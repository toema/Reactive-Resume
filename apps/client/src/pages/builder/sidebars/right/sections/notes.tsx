/* eslint-disable react-hooks/rules-of-hooks */
import { t } from "@lingui/macro";
import { RichInput } from "@reactive-resume/ui";
import { useSearchParams } from "react-router-dom";

import { usePortfolioStore } from "@/client/stores/portfolio";
import { useResumeStore } from "@/client/stores/resume";

import { getSectionIcon } from "../shared/section-icon";

export const NotesSection = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "resume";

  // Use the appropriate store based on mode
  const setValue =
    mode === "portfolio"
      ? usePortfolioStore((state) => state.setValue)
      : useResumeStore((state) => state.setValue);

  const notes =
    mode === "portfolio"
      ? usePortfolioStore((state) => state.portfolio.data.metadata.notes)
      : useResumeStore((state) => state.resume.data.metadata.notes);

  return (
    <section id="notes" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("notes")}
          <h2 className="line-clamp-1 text-3xl font-bold">{t`Notes`}</h2>
        </div>
      </header>

      <main className="grid gap-y-4">
        <p className="leading-relaxed">
          {t`This section is reserved for your personal notes specific to this ${mode}. The content here remains private and is not shared with anyone else.`}
        </p>

        <div className="space-y-1.5">
          <RichInput
            content={notes}
            onChange={(content) => {
              setValue("metadata.notes", content);
            }}
          />

          <p className="text-xs leading-relaxed opacity-75">
            {mode === "portfolio"
              ? t`For example, information regarding which companies you sent this portfolio to or the links to the job descriptions can be noted down here.`
              : t`For example, information regarding which companies you sent this resume to or the links to the job descriptions can be noted down here.`}
          </p>
        </div>
      </main>
    </section>
  );
};
