"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/lib/api";
import { LoginInput } from "@/types/api";
import { NavbarClient } from "@/components/navbarclient";
import { Footer } from "@/components/footer";

// Remove the old interface - we'll use the proper types from API

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [emailAddress, setEmailAddress] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check for registration success message
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'registration-success') {
      setSuccess("Account created successfully! Please login with your credentials.");
    } else if (message === 'otp-verified') {
      setSuccess("Email verified successfully! You can now login with your credentials.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailAddress.trim() || !passwordValue.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!emailAddress.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const credentials: LoginInput = {
        email: emailAddress.trim(),
        password: passwordValue
      };

      const response = await authApi.login(credentials);

      if (response.user && response.token) {
        // Update auth context (this will handle storage)
        login(response.user, response.token, response.expiresIn);

        // Show success message briefly then redirect
        setSuccess("Login successful! Redirecting...");

        // Small delay to show success message, then redirect
        setTimeout(() => {
          router.push("/user-dashboard");
        }, 500);
      } else {
        setError("Login response is incomplete. Please try again.");
      }
    } catch (error: unknown) {
      // Handle different types of errors
      let errorMessage = "Login failed. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("fetch") || error.message.includes("Network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (
          error.message.includes("401") ||
          error.message.toLowerCase().includes("unauthorized") ||
          error.message.toLowerCase().includes("invalid") ||
          error.message.toLowerCase().includes("credentials")
        ) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes("429")) {
          errorMessage = "Too many login attempts. Please wait a few minutes and try again.";
        } else if (error.message.includes("500")) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timeout. Please try again.";
        } else {
          errorMessage = error.message || "Login failed. Please try again.";
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (error) setError("");
      if (success) setSuccess("");
    };

  return (
    <>
      <NavbarClient />
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
        {/* Left brand panel (hidden on mobile) */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-800">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          aria-hidden
        >
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-300/10 blur-3xl" />
        </div>
        <div className="relative z-10 w-full max-w-xl px-10 py-16 text-white">
          <div className="font-semibold text-lg">
            Bangladesh Child Neurology Society
          </div>
          <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight mb-4">
            Advancing Knowledge in Child Neurology
          </h1>
          <p className="text-blue-100/90 text-base leading-relaxed">
            We are committed to education, research, and clinical excellence to
            improve neurological care for children across Bangladesh.
          </p>
        </div>
      </div>

      {/* Right login form panel */}
      <div className="bg-gray-50 flex items-center justify-center py-10 sm:py-12">
        <Card className="w-full max-w-md bg-white border border-blue-100/60 shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Member Login
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Access your member dashboard and resources
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start space-x-2">
                <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-700">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={emailAddress}
                  onChange={handleInputChange(setEmailAddress)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={passwordValue}
                    onChange={handleInputChange(setPasswordValue)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Contact us to join
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
      </section>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
