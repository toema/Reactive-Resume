import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useArtboardStore } from "../store/artboard";

export const Providers = () => {
  const setMode = useArtboardStore((state) => state.setMode);
  const setResume = useArtboardStore((state) => state.setResume);
  const setPortfolio = useArtboardStore((state) => state.setPortfolio);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "SET_MODE") setMode(event.data.payload);
      if (event.data.type === "SET_RESUME") setResume(event.data.payload);
      if (event.data.type === "SET_PORTFOLIO") setPortfolio(event.data.payload);
      if (event.data.type === "SET_THEME") {
        event.data.payload === "dark"
          ? document.documentElement.classList.add("dark")
          : document.documentElement.classList.remove("dark");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setMode, setResume, setPortfolio]);

  return <Outlet />;
};
