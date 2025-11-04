import { Github, Linkedin, Instagram, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Team() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00A859] to-emerald-400 bg-clip-text text-transparent">
              Meet The Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The minds behind Nuture - empowering student wellness through smart insurance
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="border-[#00A859]/20 hover:border-[#00A859]/50 transition-all max-w-md w-full">
              <CardContent className="pt-8">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00A859] to-emerald-400 mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
                    AB
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Akolo Bulus</h2>
                  <p className="text-[#00A859] font-semibold mb-4">Tech Lead</p>
                  
                  <p className="text-muted-foreground mb-6">
                    Leading the technical vision and development of Nuture, creating innovative solutions for student healthcare accessibility.
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <a
                      href="https://www.linkedin.com/in/akolo-bulus/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#00A859]/10 hover:bg-[#00A859]/20 flex items-center justify-center transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 text-[#00A859]" />
                    </a>
                    
                    <a
                      href="https://github.com/akolobulus/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#00A859]/10 hover:bg-[#00A859]/20 flex items-center justify-center transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5 text-[#00A859]" />
                    </a>
                    
                    <a
                      href="https://www.instagram.com/heisakolo/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#00A859]/10 hover:bg-[#00A859]/20 flex items-center justify-center transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-[#00A859]" />
                    </a>
                    
                    <a
                      href="https://x.com/BulusAkolo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#00A859]/10 hover:bg-[#00A859]/20 flex items-center justify-center transition-colors"
                      aria-label="X (Twitter)"
                    >
                      <Twitter className="w-5 h-5 text-[#00A859]" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              To make healthcare accessible, transparent, and community-driven for every NUTM student. 
              We believe in empowering students with peace of mind through reliable campus health coverage, 
              promoting responsible healthcare habits, and fostering a supportive student health community.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
