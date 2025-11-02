import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Dashboard from "./pages/Dashboard";
import SubmitClaim from "./pages/SubmitClaim";
import ClaimsTracking from "./pages/ClaimsTracking";
import Referrals from "./pages/Referrals";
import HealthTips from "./pages/HealthTips";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";

const PUBLISHABLE_KEY = "pk_test_cHJlY2lvdXMtdGFoci01OC5jbGVyay5hY2NvdW50cy5kZXYk";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <div className="dark min-h-screen bg-background text-foreground">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/submit-claim" element={<SubmitClaim />} />
              <Route path="/claims" element={<ClaimsTracking />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/health-tips" element={<HealthTips />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/checkout/:planId" element={<Checkout />} />
            </Routes>
          </Router>
          <Toaster />
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
