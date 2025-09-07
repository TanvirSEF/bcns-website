import React from "react";
import { Shield } from "lucide-react";
import { NavbarClient } from "@/components/navbarclient";
import { Footer } from "@/components/footer";
import { MembershipForm } from "@/components/membership-form";

const Membership = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 lg:py-12">
      <NavbarClient />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Join BCNS Membership
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Become part of Bangladesh Child Neurology Society and contribute to advancing pediatric neurological care and research
          </p>
        </div>

        {/* Main Form */}
        <MembershipForm />
      </div>
      <Footer />
    </div>
  );
};

export default Membership;
