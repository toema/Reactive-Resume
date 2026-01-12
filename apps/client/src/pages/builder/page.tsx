import { t } from "@lingui/macro";
import { PortfolioDto, ResumeDto } from "@reactive-resume/dto";
import { useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { LoaderFunction, redirect, useSearchParams } from "react-router-dom";

import { toast } from "@/client/hooks/use-toast";
import { queryClient } from "@/client/libs/query-client";
import { findPortfolioById } from "@/client/services/portfolio";
import { findResumeById } from "@/client/services/resume";
import { useBuilderStore } from "@/client/stores/builder";
import { usePortfolioStore } from "@/client/stores/portfolio";
import { useResumeStore } from "@/client/stores/resume";

export const BuilderPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "resume";

  const frameRef = useBuilderStore((state) => state.frame.ref);
  const setFrameRef = useBuilderStore((state) => state.frame.setRef);

  const resume = useResumeStore((state) => state.resume);
  const portfolio = usePortfolioStore((state) => state.portfolio);

  // Get title based on mode
  const title = mode === "portfolio" 
    ? (portfolio?.title || t`Untitled Portfolio`)
    : (resume?.title || t`Untitled Resume`);

  const updateDataInFrame = useCallback(() => {
    if (!frameRef?.contentWindow) return;

    let message;
    if (mode === "portfolio") {
      message = { type: "SET_PORTFOLIO", payload: portfolio.data };
    } else {
      message = { type: "SET_RESUME", payload: resume.data };
    }

    console.log("Sending message to artboard:", message);
    frameRef.contentWindow.postMessage(message, "*");
  }, [frameRef, mode, resume.data, portfolio.data]);

  // Send data to iframe on initial load
  useEffect(() => {
    if (!frameRef) return;
    
    const handleLoad = () => {
      console.log("Iframe loaded, sending data...");
      updateDataInFrame();
    };

    frameRef.addEventListener("load", handleLoad);
    return () => {
      frameRef.removeEventListener("load", handleLoad);
    };
  }, [frameRef, updateDataInFrame]);

  // Send data to iframe when data changes
  useEffect(() => {
    updateDataInFrame();
  }, [updateDataInFrame]);

  const titleString = title || t`Untitled`;

  return (
    <>
      <Helmet>
        <title>{`${titleString} - ${t`Reactive Resume`}`}</title>
      </Helmet>

      <iframe
        ref={setFrameRef}
        title={titleString}
        src={`/artboard/builder?mode=${mode}`}
        className="mt-16 w-screen"
        style={{ height: `calc(100vh - 64px)` }}
      />
    </>
  );
};

export const builderLoader: LoaderFunction<ResumeDto | PortfolioDto> = async ({
  params,
  request,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = params.id!;
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");

  try {
    // If mode is portfolio, try to fetch portfolio first
    if (mode === "portfolio") {
      try {
        const portfolio = await queryClient.fetchQuery({
          queryKey: ["portfolio", { id }],
          queryFn: () => findPortfolioById({ id }),
        });

        usePortfolioStore.setState({ portfolio });
        usePortfolioStore.temporal.getState().clear();

        return portfolio;
      } catch (portfolioError) {
        console.error(portfolioError);

        // If portfolio not found, redirect to portfolios dashboard
        toast({
          variant: "error",
          title: t`Portfolio not found`,
          description: t`The portfolio you're looking for doesn't exist or you don't have permission to view it.`,
        });

        return redirect("/dashboard/portfolios");
      }
    }

    // If mode is resume or not specified, try to fetch resume
    try {
      const resume = await queryClient.fetchQuery({
        queryKey: ["resume", { id }],
        queryFn: () => findResumeById({ id }),
      });

      useResumeStore.setState({ resume });
      useResumeStore.temporal.getState().clear();

      return resume;
    } catch (resumeError) {
      console.error(resumeError);

      // If resume not found, redirect to resumes dashboard
      toast({
        variant: "error",
        title: t`Resume not found`,
        description: t`The resume you're looking for doesn't exist or you don't have permission to view it.`,
      });

      return redirect("/dashboard/resumes");
    }
  } catch (error) {
    console.error(error);

    // Redirect to appropriate dashboard based on mode
    return redirect(mode === "portfolio" ? "/dashboard/portfolios" : "/dashboard/resumes");
  }
};
