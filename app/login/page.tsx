"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { loginUser, LoginRequest } from "@/lib/api";

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");

  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailAddress.trim() || !passwordValue.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const credentials: LoginRequest = {
        email: emailAddress.trim(),
        password: passwordValue,
      };

      const response = await loginUser(credentials);

      // Handle different response formats from your API
      if (
        response.success ||
        response.token ||
        response.access_token ||
        response.accessToken
      ) {
        setSuccess("Login successful! Redirecting...");

        // Create user object from response
        const userData = response.user || {
          id: response.id || "unknown",
          name: response.name || emailAddress.split("@")[0],
          email: emailAddress,
          avatar: response.avatar,
          role: response.role,
          createdAt: response.createdAt,
        };

        const token =
          response.token || response.access_token || response.accessToken;

        if (token) {
          login(token, userData);
        }
        // Always fetch profile after login to confirm session and populate user
        // and then redirect. This covers cookie-based sessions as well.
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        setError(
          response.message ||
            response.error ||
            "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
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
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-700">{success}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                    onChange={handleInputChange(setEmailAddress)}
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
                    onChange={handleInputChange(setPasswordValue)}
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
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Sign In"}
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
          </div>
        </Card>
      </div>
    </section>
  );
}
