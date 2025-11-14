"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { validateLoginForm } from "@/utils/validators";
import { getErrorMessage, getFieldErrors } from "@/utils/error-handler";
import { PUBLIC_ROUTES } from "@/config/routes";
import { RouteHelpers } from "@/config/routes";
import ApprovalPendingModal from "@/components/auth/ApprovalPendingModal";
import VerificationSuccessPage from "@/components/auth/VerificationSuccessPage";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    user, 
    isAuthenticated, 
    isLoading: isAuthLoading, 
    login, 
    isLoading, 
    error, 
    clearError,
    showApprovalPending,
    approvalPendingMessage,
    clearApprovalPending,
  } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user) {
      // Get redirect URL from query params or use default route
      const redirect = searchParams.get('redirect');
      const redirectRoute = redirect 
        ? redirect 
        : RouteHelpers.getRedirectRoute(user.type);
      router.push(redirectRoute);
    }
  }, [isAuthenticated, isAuthLoading, user, router, searchParams]);
  
  // Check if we should show verification success page
  const verification = searchParams.get('verification');
  
  // Show verification success page if query params are present
  if (verification === 'success') {
    return <VerificationSuccessPage />;
  }

  // Show loading state while checking auth
  if (isAuthLoading) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Don't render form if already authenticated (redirect will happen)
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to landing
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <ApprovalPendingModal
            isOpen={showApprovalPending}
            message={approvalPendingMessage || "Your account is pending admin approval. Please wait for approval before logging in."}
            onClose={clearApprovalPending}
          />
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Access your QuickMed Connect inbox with your email and password.
              </p>
            </div>
            <div>
              {/* Error message (only show if not approval pending) */}
              {error && !showApprovalPending && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {getErrorMessage(error)}
                </div>
              )}
              
              {/* Show approval pending message if query param is present */}
              {searchParams.get('status') === 'approval_pending' && !showApprovalPending && (
                <div className="mb-4 p-3 text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
                  Your account is pending admin approval. Please wait for approval before logging in.
                </div>
              )}

              <form
                onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  clearError();
                  setValidationErrors({});

                  // Validate form
                  const validation = validateLoginForm(formData);
                  if (!validation.isValid) {
                    setValidationErrors(validation.errors || {});
                    return;
                  }

                  // Submit form
                  try {
                    await login(formData);
                  } catch (err) {
                    // Error is handled by useAuth hook
                    const fieldErrors = getFieldErrors(err);
                    if (fieldErrors) {
                      setValidationErrors({
                        email: fieldErrors.email?.[0],
                        password: fieldErrors.password?.[0],
                      });
                    }
                  }
                }}
              >
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      placeholder="info@gmail.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (validationErrors.email) {
                          setValidationErrors({
                            ...validationErrors,
                            email: undefined,
                          });
                        }
                      }}
                      disabled={isLoading}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-xs text-error-500">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>
                      Password <span className="text-error-500">*</span>{" "}
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (validationErrors.password) {
                            setValidationErrors({
                              ...validationErrors,
                              password: undefined,
                            });
                          }
                        }}
                        disabled={isLoading}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                    {validationErrors.password && (
                      <p className="mt-1 text-xs text-error-500">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isChecked} onChange={setIsChecked} />
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Keep me signed in
                      </span>
                    </div>
                    <Link
                      href={PUBLIC_ROUTES.RESET_PASSWORD}
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="sm" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </div>
                </div>
              </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href={PUBLIC_ROUTES.REGISTER}
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
