import type { Metadata } from "next";
import PrescriptionsInboxWorkspace from "@/components/prescriptions/PrescriptionsInboxWorkspace";

export const metadata: Metadata = {
  title: "QuickMed Connect | Prescriptions Inbox",
  description:
    "View all incoming prescriptions from doctors. Shop owners can see prescriptions and chat with doctors.",
};

export default function PrescriptionsInboxPage() {
  return <PrescriptionsInboxWorkspace />;
}

