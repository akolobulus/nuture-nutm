import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00A859]" />
            <span className="font-bold text-[#00A859]">Nuture</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            © 2024 Nuture Health Insurance. Designed for NUTM Students.
          </p>
          
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-[#00A859] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#00A859] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#00A859] transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
