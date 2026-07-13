/**
 * Analytics helper — dispara eventos para Google Analytics 4 e/ou Plausible,
 * dependendo do que estiver configurado em site-config.ts.
 *
 * Uso:
 *   import { track } from "@/lib/analytics";
 *   track("whatsapp_click", { location: "hero" });
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

export type TrackParams = Record<string, string | number | boolean | undefined>;

export function track(event: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }

  // Plausible (custom event com props)
  if (typeof window.plausible === "function") {
    window.plausible(event, { props: params as Record<string, unknown> });
  }

  // Log em dev pra facilitar debug
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, params);
  }
}
