import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import Team from "./pages/Team";
import TransferPolicy from "./pages/TransferPolicy";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
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
            <Route path="/team" element={<Team />} />
            <Route path="/transfer-policy" element={<TransferPolicy />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </Router>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
