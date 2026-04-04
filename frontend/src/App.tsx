import { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar";
import MoodBar from "./components/layout/MoodBar";
import Footer from "./components/layout/Footer";
import BottomNav from "./components/layout/BottomNav";
import Hero from "./components/sections/Hero";
import LiveFeed from "./components/sections/LiveFeed";
import Tours from "./components/sections/Tours";
import Facts from "./components/sections/Facts";
import CTA from "./components/sections/CTA";
import type { PageConfig } from "./config/types";

export default function App() {
  const [config, setConfig] = useState<PageConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/page.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load page.json: ${r.status}`);
        return r.json();
      })
      .then(setConfig)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-primary">
        <div className="text-center p-8">
          <h1 className="font-headline font-black text-2xl mb-4">Page not generated yet</h1>
          <p className="text-on-surface-variant">Run <code className="bg-surface-container-high px-2 py-1 rounded">python manage.py generate_page</code> to create page.json</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
