"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { NavbarClient } from "@/components/navbarclient";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, AlertCircle, KeyRound } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError("Invalid reset link. Please request a new password reset.");
        }
    }, [searchParams]);

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: "", color: "" };
        if (password.length < 6) return { strength: 1, label: "Weak", color: "bg-red-500" };
        if (password.length < 8) return { strength: 2, label: "Fair", color: "bg-orange-500" };

        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

        if (score >= 3 && password.length >= 8) return { strength: 4, label: "Strong", color: "bg-green-500" };
        if (score >= 2) return { strength: 3, label: "Good", color: "bg-blue-500" };
        return { strength: 2, label: "Fair", color: "bg-orange-500" };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid reset link. Please request a new password reset.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                    password: newPassword,
                }),
            });

            const responseText = await response.text();
            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error("Failed to parse JSON response:", responseText);
                data = { message: "Invalid server response" };
            }

            if (response.ok) {
                setIsSuccess(true);
                toast.success("Password reset successful!");

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                console.error("Reset password failed:", response.status, data);
                if (response.status === 400) {
                    setError("This reset link is invalid or has expired. Please request a new one.");
                } else if (response.status === 404) {
                    setError("Account not found.");
                } else {
                    setError(data.message || "Failed to reset password. Please try again.");
                }
            }
        } catch (error) {
            console.error("Reset password error:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token && !error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50">
            <NavbarClient />

            <main className="container mx-auto px-4 py-16 sm:py-24">
                <div className="max-w-md mx-auto">
                    <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        {!isSuccess ? (
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                                        <KeyRound className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        Reset Password
                                    </h1>
                                    <p className="text-gray-600">
                                        Enter your new password below
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-red-800 font-medium">{error}</p>
                                            {error.includes("expired") && (
                                                <Link
                                                    href="/forgot-password"
                                                    className="text-sm text-red-600 hover:text-red-700 font-semibold underline mt-2 inline-block"
                                                >
                                                    Request a new reset link
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* New Password */}
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                id="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                disabled={isLoading || !token}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>

                                        {/* Password Strength Indicator */}
                                        {newPassword && (
                                            <div className="mt-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                                            style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-600">{passwordStrength.label}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Use 8+ characters with uppercase, lowercase, numbers & symbols
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                disabled={isLoading || !token}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {confirmPassword && newPassword !== confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading || !token || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Resetting Password...
                                            </>
                                        ) : (
                                            "Reset Password"
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
                                        Password Reset Successful!
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Your password has been reset successfully. You can now login with your new password.
                                    </p>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-blue-800">
                                            Redirecting to login page...
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => router.push("/login")}
                                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold"
                                    >
                                        Go to Login
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
