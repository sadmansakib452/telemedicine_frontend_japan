import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | QuickMed Connect",
  description: "Sign in to your QuickMed Connect account to access your inbox and connect with patients, doctors, and shop owners.",
};

export default function SignIn() {
  return <SignInForm />;
}
