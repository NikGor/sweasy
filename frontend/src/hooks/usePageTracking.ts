import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

/**
 * Автоматически отправляет page_view при каждой смене маршрута.
 * Использует небольшой таймаут, чтобы document.title успел обновиться из useSEO.
 */
export function usePageTracking() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const id = setTimeout(() => {
      trackPageView(pathname + search);
    }, 50);
    return () => clearTimeout(id);
  }, [pathname, search]);
}
