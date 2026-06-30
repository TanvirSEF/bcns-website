"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NavbarClient } from "@/components/navbarclient";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setIsSuccess(true);
                toast.success("Password reset link sent!");
            } else {
                // Even on error, show success message for security (prevent email enumeration)
                setIsSuccess(true);
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            // Still show success for security
            setIsSuccess(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50">
            <NavbarClient />

            <main className="container mx-auto px-4 py-16 sm:py-24">
                <div className="max-w-md mx-auto">
                    {/* Back to Login */}
                    <Link
                        href="/login"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>

                    <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        {!isSuccess ? (
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        Forgot Password?
                                    </h1>
                                    <p className="text-gray-600">
                                        No worries! Enter your email and we'll send you a reset link.
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                disabled={isLoading}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Sending Reset Link...
                                            </>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <>
                                {/* Success State */}
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                        Check Your Email
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        If an account exists with <span className="font-semibold text-gray-900">{email}</span>,
                                        you will receive a password reset link shortly.
                                    </p>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-blue-800">
                                            <strong>Didn't receive the email?</strong> Check your spam folder or try again in a few minutes.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => router.push("/login")}
                                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold"
                                    >
                                        Return to Login
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Remember your password?{" "}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
