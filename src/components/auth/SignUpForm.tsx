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
import { validateRegisterForm } from "@/utils/validators";
import { getErrorMessage, getFieldErrors } from "@/utils/error-handler";
import { USER_TYPES, type UserType } from "@/config/constants";
import { PUBLIC_ROUTES } from "@/config/routes";
import { RouteHelpers } from "@/config/routes";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";

const account_types = [
  { label: "Patient", value: USER_TYPES.PATIENT },
  { label: "Doctor", value: USER_TYPES.DOCTOR },
  { label: "Shop Keeper", value: USER_TYPES.SHOP_OWNER },
  { label: "Admin", value: USER_TYPES.ADMIN },
];

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: isAuthLoading, register, isLoading, error, clearError, pendingVerificationEmail, pendingVerificationUserType, clearPendingVerification } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedType, setSelectedType] = useState<UserType>(USER_TYPES.PATIENT);
  const [formData, setFormData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    type: USER_TYPES.PATIENT as UserType,
  });
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    type?: string;
  }>({});
  
  // Show OTP form if email is pending verification
  const showOtpForm = !!pendingVerificationEmail;

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

  // Show loading state while checking auth
  if (isAuthLoading) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar items-center justify-center">
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

  // Show OTP verification form if email is pending verification
  if (showOtpForm && pendingVerificationEmail) {
    return (
      <OtpVerificationForm
        email={pendingVerificationEmail}
        userType={pendingVerificationUserType || undefined}
        onBack={() => {
          // Clear pending verification to go back to registration form
          clearPendingVerification();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
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
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your QuickMed Connect account to start collaborating in the
              inbox.
            </p>
          </div>
          <div>
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {getErrorMessage(error)}
              </div>
            )}

            <form
              onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                clearError();
                setValidationErrors({});

                // Update formData with selected type
                const submitData = { ...formData, type: selectedType };

                // Validate form
                const validation = validateRegisterForm(submitData);
                if (!validation.isValid) {
                  setValidationErrors(validation.errors || {});
                  return;
                }

                // Submit form
                try {
                  // Register user (returns email for OTP verification)
                  await register(submitData);
                  // OTP form will be shown automatically via pendingVerificationEmail state
                } catch (err) {
                  // Error is handled by useAuth hook, but also check for field-level errors
                  const fieldErrors = getFieldErrors(err);
                  if (fieldErrors) {
                    setValidationErrors({
                      name: fieldErrors.name?.[0],
                      first_name: fieldErrors.first_name?.[0],
                      last_name: fieldErrors.last_name?.[0],
                      email: fieldErrors.email?.[0],
                      password: fieldErrors.password?.[0],
                      type: fieldErrors.type?.[0] || fieldErrors._general?.[0],
                    });
                  }
                  // The error will also be set in AuthContext and displayed via the error prop
                }
              }}
            >
              <div className="space-y-5">
                <div>
                  <Label>
                    Display Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="display_name"
                    name="display_name"
                    placeholder="Enter your display name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (validationErrors.name) {
                        setValidationErrors({
                          ...validationErrors,
                          name: undefined,
                        });
                      }
                    }}
                    disabled={isLoading}
                    error={!!validationErrors.name}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-xs text-error-500">
                      {validationErrors.name}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    This name is shown in chat lists so participants can find you
                    quickly.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                      value={formData.first_name}
                      onChange={(e) => {
                        setFormData({ ...formData, first_name: e.target.value });
                        if (validationErrors.first_name) {
                          setValidationErrors({
                            ...validationErrors,
                            first_name: undefined,
                          });
                        }
                      }}
                      disabled={isLoading}
                      error={!!validationErrors.first_name}
                    />
                    {validationErrors.first_name && (
                      <p className="mt-1 text-xs text-error-500">
                        {validationErrors.first_name}
                      </p>
                    )}
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                      value={formData.last_name}
                      onChange={(e) => {
                        setFormData({ ...formData, last_name: e.target.value });
                        if (validationErrors.last_name) {
                          setValidationErrors({
                            ...validationErrors,
                            last_name: undefined,
                          });
                        }
                      }}
                      disabled={isLoading}
                      error={!!validationErrors.last_name}
                    />
                    {validationErrors.last_name && (
                      <p className="mt-1 text-xs text-error-500">
                        {validationErrors.last_name}
                      </p>
                    )}
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
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
                    error={!!validationErrors.email}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-xs text-error-500">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
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
                      error={!!validationErrors.password}
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
                <div>
                  <Label>
                    Account Type<span className="text-error-500">*</span>
                  </Label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {account_types.map((type) => {
                      const isActive = selectedType === type.value;
                      return (
                        <button
                          type="button"
                          key={type.value}
                          onClick={() => {
                            setSelectedType(type.value as UserType);
                            setFormData({ ...formData, type: type.value as UserType });
                            if (validationErrors.type) {
                              setValidationErrors({
                                ...validationErrors,
                                type: undefined,
                              });
                            }
                          }}
                          disabled={isLoading}
                          className={`rounded-xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isActive
                              ? "border-brand-300 bg-brand-50 text-brand-600 shadow-theme-xs dark:border-brand-500/50 dark:bg-brand-500/10 dark:text-brand-200"
                              : "border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:text-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-brand-500/40 dark:hover:text-brand-300"
                          }`}
                        >
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                  {validationErrors.type && (
                    <p className="mt-1 text-xs text-error-500">
                      {validationErrors.type}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Choose the role that matches how you interact with patients,
                    doctors, or shop owners.
                  </p>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    disabled={isLoading || !isChecked}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
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
