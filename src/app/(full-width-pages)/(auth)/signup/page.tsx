import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | QuickMed Connect",
  description: "Create your QuickMed Connect account to start collaborating in the inbox. Choose your role: Patient, Doctor, Shop Owner, or Admin.",
};

export default function SignUp() {
  return <SignUpForm />;
}
