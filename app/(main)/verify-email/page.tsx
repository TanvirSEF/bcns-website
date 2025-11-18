"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OTPInput, OTPInputGroup } from '@/components/ui/otp-input';
import { CountdownTimerWithControls } from '@/components/ui/countdown-timer';
import { ResendOTPButton } from '@/components/ui/resend-otp-button';
import { 
  Mail, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Sparkles,
  Lock
} from 'lucide-react';
import { verifyOTP, resendRegistrationOTP, api } from '@/lib/api';
import { NavbarClient } from '@/components/navbarclient';
import { Footer } from '@/components/footer';
import { MembershipFormData } from '@/types/membership';

interface UserData {
  name: string;
  email: string;
  password: string;
  membershipData?: MembershipFormData;
}

function OTPVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [timerKey, setTimerKey] = useState(0); // Key to force timer reset
  const [otpResetKey, setOtpResetKey] = useState(0); // Key to force OTP input reset
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false); // Prevent multiple attempts
  const [otpVerified, setOtpVerified] = useState(false); // Track if OTP is verified
  const [isCompletingRegistration, setIsCompletingRegistration] = useState(false); // Track registration completion

  useEffect(() => {
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const password = searchParams.get('password');

    if (!name || !email || !password) {
      router.push('/membership');
      return;
    }

    // Retrieve full membership form data from localStorage
    const storedFormData = localStorage.getItem('membershipFormData');
    let membershipData: MembershipFormData | undefined;
    
    if (storedFormData) {
      try {
        membershipData = JSON.parse(storedFormData);
      } catch (error) {
        console.error('Failed to parse stored membership data:', error);
      }
    }

    // Conditionally include membershipData to avoid exactOptionalPropertyTypes issues
    setUserData({
      name,
      email,
      password,
      ...(membershipData && { membershipData }),
    });
  }, [searchParams, router]);

  const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@');
    if (!username || !domain || username.length <= 2) return email;
    
    const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
    return `${maskedUsername}@${domain}`;
  };

  const handleOTPComplete = async (otpValue: string) => {
    if (!userData || hasAttemptedVerification || isVerifying) return;
    
    setError('');
    setIsVerifying(true);
    setHasAttemptedVerification(true);


    try {
      // Step 1: Verify OTP only (don't consume it)
      const otpResponse = await verifyOTP(userData.email, otpValue);
      
      if (otpResponse && otpResponse.success && otpResponse.data && otpResponse.data.otpValid) {
        setOtpVerified(true);
        
        // Step 2: Complete registration with verified OTP
        await completeRegistration(otpValue);
      } else {
        throw new Error('OTP verification failed - invalid response');
      }
    } catch (err) {
      let errorMessage = 'Invalid OTP code. Please try again.';
      
      if (err instanceof Error) {
        // Handle different types of errors
        if (err.message.includes('validation') || err.message.includes('required')) {
          errorMessage = 'Please check your information and try again.';
        } else if (err.message.includes('expired') || err.message.includes('invalid')) {
          errorMessage = 'The verification code is invalid or has expired. Please request a new one.';
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setOtp('');
      setHasAttemptedVerification(false); // Reset on error to allow retry
      setOtpResetKey(prev => prev + 1); // Reset OTP input component
    } finally {
      setIsVerifying(false);
    }
  };

  const completeRegistration = async (otpValue: string) => {
    if (!userData) return;
    
    setIsCompletingRegistration(true);
    
    try {
      // Step 2: Complete registration with verified OTP
      // Include all membership form data if available
      const registrationData: any = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        otp: otpValue,
      };

      // Add all membership form fields if available
      if (userData.membershipData) {
        const md = userData.membershipData;
        
        // Personal Information
        if (md.formNo) registrationData.formNo = md.formNo;
        if (md.refNo) registrationData.refNo = md.refNo;
        if (md.affiliation) registrationData.affiliation = md.affiliation;
        if (md.phone) registrationData.phone = md.phone;
        if (md.mailingAddress) registrationData.mailingAddress = md.mailingAddress;
        if (md.permanentAddress) registrationData.permanentAddress = md.permanentAddress;

        // Education Qualifications - build array
        const educationQualifications: Array<{ qualification: string; year: string; institution: string }> = [];
        if (md.mbbsYear || md.mbbsInstitution) {
          educationQualifications.push({
            qualification: 'MBBS',
            year: md.mbbsYear || '',
            institution: md.mbbsInstitution || '',
          });
        }
        if (md.fcpsMdYear || md.fcpsMdInstitution) {
          educationQualifications.push({
            qualification: 'FCPS/MD',
            year: md.fcpsMdYear || '',
            institution: md.fcpsMdInstitution || '',
          });
        }
        if (md.mdFcpsYear || md.mdFcpsInstitution) {
          educationQualifications.push({
            qualification: 'MD/FCPS',
            year: md.mdFcpsYear || '',
            institution: md.mdFcpsInstitution || '',
          });
        }
        if (md.additionalDegree && (md.additionalYear || md.additionalInstitution)) {
          educationQualifications.push({
            qualification: md.additionalDegree,
            year: md.additionalYear || '',
            institution: md.additionalInstitution || '',
          });
        }
        if (educationQualifications.length > 0) {
          registrationData.educationQualifications = educationQualifications;
        }

        // Training - build array
        const training: Array<{ period: string; institute: string }> = [];
        if (md.training1Period || md.training1Institute) {
          training.push({
            period: md.training1Period || '',
            institute: md.training1Institute || '',
          });
        }
        if (md.training2Period || md.training2Institute) {
          training.push({
            period: md.training2Period || '',
            institute: md.training2Institute || '',
          });
        }
        if (md.training3Period || md.training3Institute) {
          training.push({
            period: md.training3Period || '',
            institute: md.training3Institute || '',
          });
        }
        if (training.length > 0) {
          registrationData.training = training;
        }

        // Research Interests
        if (md.researchInterest1) registrationData.primaryResearchInterest = md.researchInterest1;
        if (md.researchInterest2) registrationData.secondaryResearchInterest = md.researchInterest2;
      }

      // Call the API directly with the full registration data
      // Type cast to VerifyOTPInput since we're extending it with additional fields
      const response = await api.auth.verifyRegistrationOTP(registrationData as any);

      // CRITICAL: Only proceed if we have valid user data
      if (response && response.user) {
        setSuccess(true);
        
        // Clean up localStorage after successful registration
        localStorage.removeItem('membershipFormData');
        
        // After successful registration, redirect to payment page
        // User will complete payment and then login
        setTimeout(() => {
          router.push(
            '/payment?email=' + 
            encodeURIComponent(userData.email) + 
            '&name=' + 
            encodeURIComponent(userData.name)
          );
        }, 2000);
      } else {
        throw new Error('Invalid registration response - no user data received');
      }
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setOtpVerified(false); // Reset OTP verification status
    } finally {
      setIsCompletingRegistration(false);
    }
  };

  const handleVerify = async () => {
    if (!userData || otp.length !== 6) {
      setError('Please enter a complete 6-digit code');
      return;
    }

    if (hasAttemptedVerification || isVerifying) {
      return; // Prevent multiple attempts
    }

    await handleOTPComplete(otp);
  };

  const handleResendOTP = async () => {
    if (!userData) return;

    try {
      await resendRegistrationOTP(userData.email);
      
      // Reset the timer by changing the key
      setTimerKey(prev => prev + 1);
      setError(''); // Clear any previous errors
      setHasAttemptedVerification(false); // Reset verification attempt flag
      setOtpVerified(false); // Reset OTP verification status
      setOtpResetKey(prev => prev + 1); // Reset OTP input component
    } catch (error) {
      // Error will be handled by the ResendOTPButton component
    }
  };

  const handleTimerExpire = () => {
    setError('Your verification code has expired. Please request a new one.');
  };

  const handleBackToRegistration = () => {
    router.push('/membership');
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <NavbarClient />
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="container mx-auto px-4 max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
                    We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-blue-600 mt-1">
              {maskEmail(userData.email)}
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              {/* Success State */}
              {success && (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-900 mb-2">
                      Registration Completed Successfully! 🎉
                    </h3>
                    <p className="text-green-700">
                      Welcome to BCNS! Your account has been created and verified successfully.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">Redirecting to payment page</span>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Verification Form */}
              {!success && (
                <div className="space-y-6">
                  {/* Timer */}
                  <div className="flex justify-center">
                    <CountdownTimerWithControls
                      key={timerKey} // Force reset when key changes
                      duration={600} // 10 minutes
                      onExpire={handleTimerExpire}
                      warningThreshold={120} // 2 minutes warning
                      format="MM:SS"
                    />
                  </div>

                  {/* OTP Input */}
                  <OTPInputGroup
                    label="Enter Verification Code"
                    description="Enter the 6-digit code sent to your email"
                    error={error}
                  >
                    <div className="flex justify-center">
                      <OTPInput
                        length={6}
                        value={otp}
                        onChange={setOtp}
                        onComplete={handleOTPComplete}
                        disabled={isVerifying}
                        autoFocus
                        resetKey={otpResetKey}
                      />
                    </div>
                  </OTPInputGroup>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-700 font-medium">Verification Failed</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Manual Verify Button */}
                  <Button
                    onClick={handleVerify}
                    disabled={isVerifying || otp.length !== 6 || hasAttemptedVerification}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {otpVerified ? 'Completing Registration...' : 'Verifying OTP...'}
                      </>
                    ) : isCompletingRegistration ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Completing Registration...
                      </>
                    ) : hasAttemptedVerification ? (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        {otpVerified ? 'Registration in Progress...' : 'Verification Sent'}
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        Verify Email
                      </>
                    )}
                  </Button>

                  {/* Resend Section */}
                  <div className="text-center space-y-3">
                    <p className="text-gray-600 text-sm">
                      Didn&apos;t receive the code?
                    </p>
                    
                    <ResendOTPButton
                      onResend={handleResendOTP}
                      cooldownSeconds={30}
                      disabled={isVerifying}
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      text={{
                        ready: 'Resend Code',
                        success: 'Code Sent to Email!',
                        error: 'Failed to Send Code'
                      }}
                      onSuccess={() => {
                        // Additional success handling if needed
                      }}
                      onError={(error) => {
                        setError(`Failed to resend code: ${error}`);
                      }}
                    />
                  </div>

                  {/* Back to Registration */}
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={handleBackToRegistration}
                      variant="ghost"
                      className="w-full text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Registration
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          {!success && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-900 font-medium text-sm">Security Notice</p>
                  <p className="text-blue-700 text-xs mt-1">
                    Your verification code expires in 10 minutes for security. 
                    If you don&apos;t receive it, check your spam folder or request a new code.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading verification page...</p>
        </div>
      </div>
    }>
      <OTPVerificationContent />
    </Suspense>
  );
}
