import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { ProjectDetails } from "./pages/ProjectDetails";
import CV from "./pages/CV";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ScrollToTop";

// Redirect component for external interview notes
const InterviewNotesRedirect = () => {
  window.location.href = "https://interviews.prodevopsguytech.com/";
  return null;
};

// Redirect component for Google Docs notes
const GoogleDocsRedirect = () => {
  window.location.href = "https://docs.google.com/document/d/14z5K1lSAm9FC7QYOqhczLwscymkwigBjj23BzfmiNmM/edit?usp=sharing";
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/interview-notes" element={<InterviewNotesRedirect />} />
          <Route path="/notes" element={<GoogleDocsRedirect />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;