"use client";
import { useEffect } from "react";

export default function AxeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    import("@axe-core/react").then(({ default: axe }) => {
      import("react").then((React) => {
        import("react-dom").then((ReactDOM) => {
          axe(React, ReactDOM, 1000);
        });
      });
    });
  }, []);
  return <>{children}</>;
}
