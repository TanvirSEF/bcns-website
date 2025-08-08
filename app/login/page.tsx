"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<"password" | "2fa">(
    "password"
  );
  const [emailAddress, setEmailAddress] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");

  const handleSubmitPasswordStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // NOTE: Hook up real auth here. On success, move to 2FA step.
    setCurrentStep("2fa");
  };

  const handleSubmitTwoFactorStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // NOTE: Verify OTP here and redirect to the dashboard.
  };

  return (
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

            {currentStep === "password" && (
              <form className="space-y-5" onSubmit={handleSubmitPasswordStep}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={isPasswordVisible ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={passwordValue}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={
                        isPasswordVisible ? "Hide password" : "Show password"
                      }
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-blue-700 hover:text-blue-800"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign In
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Create one now
                  </Link>
                </p>
              </form>
            )}

            {currentStep === "2fa" && (
              <form className="space-y-5" onSubmit={handleSubmitTwoFactorStep}>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Two‑Factor Authentication
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Enter the 6‑digit code sent to your email or authenticator
                    app.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Verification code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="••••••"
                    required
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full rounded-md border border-gray-300 bg-white py-2.5 px-3 text-center tracking-widest text-lg text-gray-900 placeholder:text-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/3"
                    onClick={() => setCurrentStep("password")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Verify & Continue
                  </Button>
                </div>
                <p className="text-center text-xs text-gray-500">
                  Haven&apos;t received a code?{" "}
                  <button
                    type="button"
                    className="underline underline-offset-2 hover:text-gray-700"
                  >
                    Resend
                  </button>
                </p>
              </form>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
