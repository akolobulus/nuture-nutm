import { Link } from "react-router-dom";
import { Activity, Home, FileText, Gift, Lightbulb, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Activity className="w-6 h-6 text-[#00A859]" />
            <span className="text-[#00A859]">Nuture</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm hover:text-[#00A859] transition-colors flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link to="/plans" className="text-sm hover:text-[#00A859] transition-colors flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Plans
            </Link>
            <Link to="/dashboard" className="text-sm hover:text-[#00A859] transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/claims" className="text-sm hover:text-[#00A859] transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Claims
            </Link>
            <Link to="/referrals" className="text-sm hover:text-[#00A859] transition-colors flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Referrals
            </Link>
            <Link to="/health-tips" className="text-sm hover:text-[#00A859] transition-colors flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Health Tips
            </Link>
          </div>

          <Button asChild className="bg-[#00A859] hover:bg-[#008f4a] text-white">
            <Link to="/submit-claim">Submit Claim</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
