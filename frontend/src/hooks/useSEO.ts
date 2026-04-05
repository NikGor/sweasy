import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
}

const SITE_URL = "https://sweasy.ch";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({ title, description, canonical, noindex }: SEOOptions) {
  useEffect(() => {
    document.title = title;

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
      setMeta("twitter:description", description);
    }

    setMeta("og:title", title, "property");
    setMeta("twitter:title", title);

    const url = canonical ?? (SITE_URL + window.location.pathname);
    setCanonical(url);
    setMeta("og:url", url, "property");
    setMeta("twitter:url", url);

    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  }, [title, description, canonical, noindex]);
}
