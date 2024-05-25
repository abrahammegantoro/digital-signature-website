"use client"

import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import isBrowser from "@/helpers/is-browser";
import isSmallScreen from "@/helpers/is-small-screen";

interface SidebarContextProps {
  isOpenOnSmallScreens: boolean;
  isPageWithSidebar: boolean;
  setOpenOnSmallScreens: (isOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>(undefined!);

export function SidebarProvider({ children }: PropsWithChildren) {
  const location = isBrowser() ? window.location.pathname : "/";
  const [isOpen, setOpen] = useState(
    isBrowser()
      ? window.localStorage.getItem("isSidebarOpen") === "true"
      : false
  );

  useEffect(() => {
    window.localStorage.setItem("isSidebarOpen", isOpen.toString());
  }, [isOpen]);

  useEffect(() => {
    if (isSmallScreen()) {
      setOpen(false);
    }
  }, [location]);

  useEffect(() => {
    function handleMobileTapInsideMain(event: MouseEvent) {
      const main = document.querySelector("main");
      const isClickInsideMain = main?.contains(event.target as Node);

      if (isSmallScreen() && isClickInsideMain) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMobileTapInsideMain);
    return () => {
      document.removeEventListener("mousedown", handleMobileTapInsideMain);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpenOnSmallScreens: isOpen,
        isPageWithSidebar: true,
        setOpenOnSmallScreens: setOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext(): SidebarContextProps {
  const context = useContext(SidebarContext);

  if (typeof context === "undefined") {
    throw new Error(
      "useSidebarContext should be used within the SidebarContext provider!"
    );
  }

  return context;
}