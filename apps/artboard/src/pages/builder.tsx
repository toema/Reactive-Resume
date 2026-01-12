import { SectionKey } from "@reactive-resume/schema";
import { pageSizeMap, Template, PortfolioTemplate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useSearchParams } from "react-router-dom";

import { MM_TO_PX, Page } from "../components/page";
import { useArtboardStore } from "../store/artboard";
import { getTemplate } from "../templates";
import { getPortfolioTemplate } from "../templates/portfolio/registry";
import { PortfolioTemplateProps } from "../templates/portfolio/types";
import { TemplateProps } from "../types/template";

export const BuilderLayout = () => {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "resume";

  // Get data based on mode
  const resumeData = useArtboardStore((state) => state.resume);
  const portfolioData = useArtboardStore((state) => state.portfolio);

  const format = useArtboardStore((state) => {
    if (mode === "portfolio") {
      return state.portfolio?.metadata?.page?.format || "a4";
    }
    return state.resume?.metadata?.page?.format || "a4";
  });

  const layout = useArtboardStore((state) => {
    if (mode === "portfolio") {
      return state.portfolio?.metadata?.layout?.sections || [];
    }
    return state.resume?.metadata?.layout || [];
  });

  const template = useArtboardStore((state) => {
    if (mode === "portfolio") {
      return state.portfolio?.metadata?.template as PortfolioTemplate;
    }
    return state.resume?.metadata?.template as Template;
  });

  const TemplateComponent = useMemo(() => {
    if (mode === "portfolio") {
      return getPortfolioTemplate(template as string);
    }
    return getTemplate(template as Template);
  }, [template, mode]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "ZOOM_IN") transformRef.current?.zoomIn(0.2);
      if (event.data.type === "ZOOM_OUT") transformRef.current?.zoomOut(0.2);
      if (event.data.type === "CENTER_VIEW") transformRef.current?.centerView();
      if (event.data.type === "RESET_VIEW") {
        transformRef.current?.resetTransform(0);
        setTimeout(() => transformRef.current?.centerView(0.8, 0), 10);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [transformRef]);

  // Portfolio Builder
  if (mode === "portfolio") {
    if (!TemplateComponent || !portfolioData) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p>Loading portfolio builder...</p>
        </div>
      );
    }

    const PortfolioTemplate = TemplateComponent as React.ComponentType<PortfolioTemplateProps>;

    return (
      <TransformWrapper
        ref={transformRef}
        centerOnInit
        maxScale={2}
        minScale={0.4}
        initialScale={0.8}
        limitToBounds={false}
      >
        <TransformComponent
          wrapperClass="!w-screen !h-screen"
          contentClass="flex items-start justify-center pointer-events-none"
        >
          <Page mode="builder" pageNumber={1}>
            <PortfolioTemplate data={portfolioData} />
          </Page>
        </TransformComponent>
      </TransformWrapper>
    );
  }

  // Resume Builder
  if (!TemplateComponent || !resumeData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading resume builder...</p>
      </div>
    );
  }

  const ResumeTemplate = TemplateComponent as React.ComponentType<TemplateProps>;

  return (
    <TransformWrapper
      ref={transformRef}
      centerOnInit
      maxScale={2}
      minScale={0.4}
      initialScale={0.8}
      limitToBounds={false}
    >
      <TransformComponent
        wrapperClass="!w-screen !h-screen"
        contentClass="grid items-start justify-center space-x-12 pointer-events-none"
        contentStyle={{
          width: `${layout.length * (pageSizeMap[format].width * MM_TO_PX + 42)}px`,
          gridTemplateColumns: `repeat(${layout.length}, 1fr)`,
        }}
      >
        <AnimatePresence>
          {layout.map((columns, pageIndex) => (
            <motion.div
              key={pageIndex}
              layout
              initial={{ opacity: 0, x: -200, y: 0 }}
              animate={{ opacity: 1, x: 0, transition: { delay: pageIndex * 0.3 } }}
              exit={{ opacity: 0, x: -200 }}
            >
              <Page mode="builder" pageNumber={pageIndex + 1}>
                <ResumeTemplate isFirstPage={pageIndex === 0} columns={columns as SectionKey[][]} />
              </Page>
            </motion.div>
          ))}
        </AnimatePresence>
      </TransformComponent>
    </TransformWrapper>
  );
};
