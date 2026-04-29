"use client";
import { useEffect } from "react";

export default function AxeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    // @axe-core/react monkey-patches React.createElement to instrument renders.
    // React 19's frozen module exports reject that mutation, throwing
    // "Cannot set property createElement of [object Module] which has only a getter"
    // and flooding the dev console. Catch and warn once so the dev tree still
    // mounts; production is unaffected because of the NODE_ENV guard.
    import("@axe-core/react").then(({ default: axe }) => {
      import("react").then((React) => {
        import("react-dom").then((ReactDOM) => {
          try {
            axe(React, ReactDOM, 1000);
          } catch (err) {
            console.warn(
              "[AxeProvider] @axe-core/react is incompatible with the current React version; skipping a11y instrumentation:",
              err instanceof Error ? err.message : String(err),
            );
          }
        });
      });
    });
  }, []);
  return <>{children}</>;
}
