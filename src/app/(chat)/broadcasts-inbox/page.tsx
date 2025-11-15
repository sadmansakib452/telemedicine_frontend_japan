import type { Metadata } from "next";
import BroadcastsInboxWorkspace from "@/components/broadcast/BroadcastsInboxWorkspace";

export const metadata: Metadata = {
  title: "QuickMed Connect | Broadcast Inbox",
  description:
    "View and respond to patient broadcasts. Start conversations with patients who need medical assistance.",
};

export default function BroadcastsInboxPage() {
  return <BroadcastsInboxWorkspace />;
}

