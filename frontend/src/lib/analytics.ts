// Google Analytics 4 с Consent Mode v2 (GDPR/FADP-совместимо).
// Подключение: задайте VITE_GA_MEASUREMENT_ID=G-XXXXXXX в .env — всё остальное автоматически.

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const CONSENT_KEY = "sweasy-cookie-consent";

let initialized = false;

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

/**
 * Инициализация GA4. Вызывается один раз при старте приложения.
 * До получения согласия все сигналы denied (Consent Mode v2).
 */
export function initAnalytics() {
  if (initialized || !GA_ID || typeof window === "undefined") return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag;

  // Consent Mode v2 — по умолчанию всё denied до явного согласия
  const stored = localStorage.getItem(CONSENT_KEY);
  const granted = stored === "accept";

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: granted ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });

  // Подгружаем gtag.js
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", GA_ID, {
    send_page_view: false, // SPA: трекаем вручную при смене маршрута
    anonymize_ip: true,
  });
}

/**
 * Обновить согласие пользователя после клика в cookie-баннере.
 */
export function updateConsent(granted: boolean) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

/**
 * Трекинг просмотра страницы (вызывается при смене маршрута в SPA).
 */
export function trackPageView(path: string, title?: string) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
}

/**
 * Произвольное событие (клик на CTA, отправка формы и т.п.).
 * Params: https://developers.google.com/analytics/devguides/collection/ga4/events
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
