import { t } from "@lingui/macro";
import { PortfolioDto, ResumeDto } from "@reactive-resume/dto";
import { useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { LoaderFunction, redirect, useSearchParams } from "react-router-dom";

import { queryClient } from "@/client/libs/query-client";
import { findPortfolioById } from "@/client/services/portfolio";
import { findResumeById } from "@/client/services/resume";
import { useBuilderStore } from "@/client/stores/builder";
import { usePortfolioStore } from "@/client/stores/portfolio";
import { useResumeStore } from "@/client/stores/resume";

export const BuilderPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") as "resume" | "portfolio" ?? "resume";

  const frameRef = useBuilderStore((state) => state.frame.ref);
  const setFrameRef = useBuilderStore((state) => state.frame.setRef);

  const resume = useResumeStore((state) => state.resume);
  const portfolio = usePortfolioStore((state) => state.portfolio);

  const title = mode === "resume" ? resume.title : portfolio.title;
  const data = mode === "resume" ? resume.data : portfolio.data;

  const updateDataInFrame = useCallback(() => {
    if (!frameRef?.contentWindow) return;

    // Send mode to artboard
    frameRef.contentWindow.postMessage({ type: "SET_MODE", payload: mode }, "*");

    // Send data based on mode
    const message = {
      type: mode === "resume" ? "SET_RESUME" : "SET_PORTFOLIO",
      payload: data,
    };
    frameRef.contentWindow.postMessage(message, "*");
  }, [frameRef, mode, data]);

  // Send data to iframe on initial load
  useEffect(() => {
    if (!frameRef) return;
    frameRef.addEventListener("load", updateDataInFrame);
    return () => frameRef.removeEventListener("load", updateDataInFrame);
  }, [frameRef]);

  // Send data to iframe on change of data
  useEffect(updateDataInFrame, [data]);

  // Handle messages from artboard
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "PAGE_LOADED") {
        frameRef?.contentWindow?.postMessage(
          { type: "SET_THEME", payload: document.documentElement.classList.contains("dark") ? "dark" : "light" },
          "*"
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [frameRef]);

  return (
    <>
      <Helmet>
        <title>
          {title} - {t`Reactive Resume`}
        </title>
      </Helmet>

      <iframe
        ref={setFrameRef}
        title={title}
        src="/artboard/builder"
        className="mt-16 w-screen"
        style={{ height: `calc(100vh - 64px)` }}
      />
    </>
  );
};

export const builderLoader: LoaderFunction<ResumeDto | PortfolioDto> = async ({ params, request }) => {
  try {
    const url = new URL(request.url);
    const mode = url.searchParams.get("mode") as "resume" | "portfolio" ?? "resume";
    const id = params.id!;

    if (mode === "portfolio") {
      const portfolio = await queryClient.fetchQuery({
        queryKey: ["portfolio", { id }],
        queryFn: () => findPortfolioById({ id }),
      });

      usePortfolioStore.setState({ portfolio });
      usePortfolioStore.temporal.getState().clear();

      return portfolio;
    }

    const resume = await queryClient.fetchQuery({
      queryKey: ["resume", { id }],
      queryFn: () => findResumeById({ id }),
    });

    useResumeStore.setState({ resume });
    useResumeStore.temporal.getState().clear();

    return resume;
  } catch {
    return redirect("/dashboard");
  }
};
