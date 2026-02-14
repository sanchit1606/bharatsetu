import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductLabelAuditor from "./pages/ProductLabelAuditor";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Documentation from "./pages/Documentation";
import Technical from "./pages/Technical";
import { PlaceholderPage } from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

// Layout wrapper component
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function HealthToolsLanding() {
  return (
    <div className="container-main py-12 sm:py-16">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-semibold text-primary mb-3">
          Health Tools
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Lab Report Analyzer &amp; Health Triage
        </h1>
        <p className="text-foreground/70 mb-10">
          Choose one of the tools below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <Link
            to="/lab-analyzer"
            className="block rounded-xl border border-border bg-card p-6 hover:shadow-md hover:border-primary transition-all"
          >
            <h2 className="text-lg font-bold text-foreground mb-2">
              Lab Report Analyzer
            </h2>
            <p className="text-sm text-foreground/70">
              Upload and understand lab reports with lifestyle suggestions and health insights.
            </p>
          </Link>

          <Link
            to="/healthcare-triage"
            className="block rounded-xl border border-border bg-card p-6 hover:shadow-md hover:border-primary transition-all"
          >
            <h2 className="text-lg font-bold text-foreground mb-2">
              Healthcare Information Triage
            </h2>
            <p className="text-sm text-foreground/70">
              Understand symptoms and get guidance on which healthcare service to contact.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<LayoutWrapper><Index /></LayoutWrapper>} />
          <Route path="/about" element={<LayoutWrapper><About /></LayoutWrapper>} />
          <Route path="/documentation" element={<LayoutWrapper><Documentation /></LayoutWrapper>} />
          <Route path="/technical" element={<LayoutWrapper><Technical /></LayoutWrapper>} />
          <Route path="/contact" element={<LayoutWrapper><Contact /></LayoutWrapper>} />

          {/* Module Pages */}
          <Route path="/product-label-auditor" element={<LayoutWrapper><ProductLabelAuditor /></LayoutWrapper>} />
          <Route path="/health-tools" element={<LayoutWrapper><HealthToolsLanding /></LayoutWrapper>} />

          {/* Placeholder Pages - Coming Soon */}
          <Route path="/civicsense-assistant" element={<LayoutWrapper><PlaceholderPage title="CivicSense Assistant" description="Report civic issues and get connected to relevant authorities and resources." /></LayoutWrapper>} />
          <Route path="/gynae-care" element={<LayoutWrapper><PlaceholderPage title="GynaeCare – Women's Health Module" description="Access women's health resources, myths vs facts, and healthcare support." /></LayoutWrapper>} />
          <Route path="/legal-rights" element={<LayoutWrapper><PlaceholderPage title="Legal & Financial Rights Assistant" description="Get guidance on legal rights, financial matters, and consumer protection." /></LayoutWrapper>} />
          <Route path="/healthcare-triage" element={<LayoutWrapper><PlaceholderPage title="Healthcare Information Triage" description="Understand symptoms and get guidance on which healthcare service to contact." /></LayoutWrapper>} />
          <Route path="/lab-analyzer" element={<LayoutWrapper><PlaceholderPage title="Lab Report Analyzer" description="Upload and understand lab reports with lifestyle suggestions and health insights." /></LayoutWrapper>} />

          {/* 404 Catch-all */}
          <Route path="*" element={<LayoutWrapper><NotFound /></LayoutWrapper>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
