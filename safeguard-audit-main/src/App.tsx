
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import SubmitContent from "./pages/SubmitContent";
import ContentStatus from "./pages/ContentStatus";
import NotFound from "./pages/NotFound";
import { ContextProvider } from "./context/AppContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ContextProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="submit" element={<SubmitContent />} />
              <Route path="status/:id" element={<ContentStatus />} />
              <Route path="moderator" element={<ModeratorDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ContextProvider>
  </QueryClientProvider>
);

export default App;
