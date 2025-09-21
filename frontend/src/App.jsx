import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis/Analysis";
import AnalysisResults from "./pages/Analysis/AnalysisResult";
import DoctorConnect from "./pages/DoctorConnect";
import Predictions from "./pages/Predictions";
import Files from "./pages/Files";
import Variants from "./pages/Variants";
import Reports from "./pages/Reports";
import Visualizations from "./pages/Visualizations";
import Lifestyle from "./pages/LifeStyle";
import ReferenceDatabase from "./pages/ReferenceDatabase";
import Privacy from "./pages/Privacy";
import Settings from "./pages/Settings";
import ClinicianDashboard from "./pages/ClinicianDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ConsentForm from "./pages/ConsentPage";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/ScrollTop";
import SignUp from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/consent" element={<ConsentForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/clinician-dashboard" element={<ClinicianDashboard />} />
          <Route
            path="/researcher-dashboard"
            element={<ResearcherDashboard />}
          />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analysis/:analysisId" element={<AnalysisResults />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/doctor" element={<DoctorConnect />} />
          <Route path="/files" element={<Files />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/visualizations" element={<Visualizations />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
          <Route path="/database" element={<ReferenceDatabase />} />

          <Route path="/privacy" element={<Privacy />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/variants" element={<Variants />} />

          {/* <Route path="/profile" element={<Profile />} /> */}

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
