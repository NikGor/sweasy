import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import MoodBar from "../components/layout/MoodBar";
import Footer from "../components/layout/Footer";
import BottomNav from "../components/layout/BottomNav";
import Hero from "../components/sections/Hero";
import LiveFeed from "../components/sections/LiveFeed";
import Tours from "../components/sections/Tours";
import Facts from "../components/sections/Facts";
import CTA from "../components/sections/CTA";
import type { PageConfig } from "../config/types";
import { useSEO } from "../hooks/useSEO";

export default function Home() {
  const [config, setConfig] = useState<PageConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: "Sweasy — авторские туры по Швейцарии с русскоязычным гидом",
    description:
      "Авторские туры по Швейцарии с русскоязычным гидом. Альпы, озёра, деревни и настоящая швейцарская жизнь глазами того, кто в ней влюблён.",
  });

  useEffect(() => {
    fetch("/api/page/")
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(setConfig)
      .catch(() => {
        fetch("/page.json")
          .then((r) => {
            if (!r.ok) throw new Error(`${r.status}`);
            return r.json();
          })
          .then(setConfig)
          .catch((e) => setError(e.message));
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-[#0a0f1e] text-primary dark:text-white">
        <div className="text-center p-8">
          <h1 className="font-headline font-black text-2xl mb-4">Page not generated yet</h1>
          <p className="text-on-surface-variant dark:text-white/60">
            Run{" "}
            <code className="bg-surface-container-high dark:bg-[#1a2133] px-2 py-1 rounded">
              python manage.py generate_page
            </code>{" "}
            to create page.json
          </p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-[#0a0f1e]">
        <div className="w-8 h-8 border-4 border-primary dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar config={config.navbar} />
      <main className="pt-16">
        <MoodBar config={config.mood_bar} />
        <Hero config={config.hero} />
        <LiveFeed config={config.live_feed} />
        <Tours config={config.tours} />
        <Facts config={config.facts} />
        <CTA config={config.cta} />
      </main>
      <Footer config={config.footer} />
      <BottomNav />
    </>
  );
}
