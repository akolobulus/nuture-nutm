import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SignUp() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join Nuture to get affordable student insurance
            </p>
          </div>
          
          <ClerkSignUp 
            routing="path" 
            path="/sign-up"
            signInUrl="/sign-in"
            afterSignUpUrl="/onboarding"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-card shadow-lg",
              },
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
