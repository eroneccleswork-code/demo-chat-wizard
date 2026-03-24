import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Demo from "./pages/Demo.tsx";
import Setup from "./pages/Setup.tsx";
import JourneySetup from "./pages/JourneySetup.tsx";
import Journey from "./pages/Journey.tsx";
import CallJourneySetup from "./pages/CallJourneySetup.tsx";
import CallJourneyPage from "./pages/CallJourneyPage.tsx";
import IntegrationsPage from "./pages/IntegrationsPage.tsx";
import IntegrationsPage from "./pages/IntegrationsPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/journey-setup" element={<JourneySetup />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/call-journey-setup" element={<CallJourneySetup />} />
          <Route path="/call-journey" element={<CallJourneyPage />} />
          <Route path="/demo" element={<Demo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
