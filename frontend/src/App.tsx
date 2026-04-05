import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Impressum from "./pages/Impressum";
import Cookies from "./pages/Cookies";
import CookieBanner from "./components/ui/CookieBanner";
import { usePageTracking } from "./hooks/usePageTracking";

function AppRoutes() {
  usePageTracking();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/impressum" element={<Impressum />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <CookieBanner />
    </BrowserRouter>
  );
}
