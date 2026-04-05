import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Impressum from "./pages/Impressum";
import Cookies from "./pages/Cookies";
import Hiking from "./pages/Hiking";
import Yachting from "./pages/Yachting";
import IndividualTours from "./pages/IndividualTours";
import VipTours from "./pages/VipTours";
import FamilyTours from "./pages/FamilyTours";
import Lucerne from "./pages/Lucerne";
import Interlaken from "./pages/Interlaken";
import Zurich from "./pages/Zurich";
import CookieBanner from "./components/ui/CookieBanner";
import { usePageTracking } from "./hooks/usePageTracking";

function AppRoutes() {
  usePageTracking();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hiking" element={<Hiking />} />
      <Route path="/yachting" element={<Yachting />} />
      <Route path="/individual-tours" element={<IndividualTours />} />
      <Route path="/vip-tours" element={<VipTours />} />
      <Route path="/family-tours" element={<FamilyTours />} />
      <Route path="/lucerne" element={<Lucerne />} />
      <Route path="/interlaken" element={<Interlaken />} />
      <Route path="/zurich" element={<Zurich />} />
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
