/**
 * OTP Verification Form Component
 * 
 * Form for verifying email address with 6-digit OTP code.
 * Displayed after successful registration.
 */

"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage, getFieldErrors } from "@/utils/error-handler";
import { PUBLIC_ROUTES } from "@/config/routes";
import Link from "next/link";
import { ChevronLeftIcon } from "@/icons";
import type { UserType } from "@/config/constants";

type OtpVerificationFormProps = {
  email: string;
  userType?: UserType; // User type for conditional messaging
  onBack?: () => void;
};

export default function OtpVerificationForm({
  email,
  userType,
  onBack,
}: OtpVerificationFormProps) {
  const { verifyEmail, isVerifyingEmail, error, clearError, pendingVerificationUserType } = useAuth();
  
  // Use userType from props or from context
  const currentUserType = userType || pendingVerificationUserType;
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setValidationError(null);
    clearError();

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Only accept 6 digits
    if (!/^\d{6}$/.test(pastedData)) {
      setValidationError('Please paste a valid 6-digit code');
      return;
    }

    const digits = pastedData.split('');
    setOtp(digits);
    setValidationError(null);
    clearError();
    
    // Focus last input
    inputRefs.current[5]?.focus();
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    // Validate OTP
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setValidationError('Please enter the complete 6-digit code');
      return;
    }

    if (!/^\d{6}$/.test(otpString)) {
      setValidationError('Please enter a valid 6-digit code');
      return;
    }

    try {
      // Verify email with OTP
      await verifyEmail({
        email,
        token: otpString,
      });
      // Redirect is handled by AuthContext
    } catch (err) {
      // Error is handled by useAuth hook
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors) {
        setValidationError(
          fieldErrors.token?.[0] || 
          fieldErrors.email?.[0] || 
          'Invalid verification code. Please try again.'
        );
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to registration
          </button>
        ) : (
          <Link
            href={PUBLIC_ROUTES.REGISTER}
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to registration
          </Link>
        )}
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We&apos;ve sent a 6-digit verification code to{" "}
              <span className="font-medium text-gray-900 dark:text-white/90">
                {email}
              </span>
              . Please enter the code below.
            </p>
            {currentUserType && (currentUserType === 'doctor' || currentUserType === 'shop_keeper' || (currentUserType as string) === 'shop_owner') && (
              <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                Note: After verification, your account will be reviewed by an administrator before you can log in.
              </p>
            )}
          </div>

          <div>
            {/* Error message */}
            {(error || validationError) && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {validationError || getErrorMessage(error)}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* OTP Input */}
                <div>
                  <Label>
                    Verification Code <span className="text-error-500">*</span>
                  </Label>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        disabled={isVerifyingEmail}
                        className="w-12 h-14 text-center text-lg font-semibold rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500"
                      />
                    ))}
                  </div>
                  {validationError && (
                    <p className="mt-2 text-xs text-error-500">
                      {validationError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    disabled={isVerifyingEmail || otp.join('').length !== 6}
                  >
                    {isVerifyingEmail ? "Verifying..." : "Verify Email"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  onClick={() => {
                    // TODO: Implement resend OTP if endpoint is available
                    alert('Resend OTP functionality will be available soon.');
                  }}
                >
                  Resend Code
                </button>
              </p>
            </div>

            {/* Sign In Link */}
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                Already verified?{" "}
                <Link
                  href={PUBLIC_ROUTES.LOGIN}
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

