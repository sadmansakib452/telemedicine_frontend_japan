import type { Metadata } from "next";
import InboxWorkspace from "@/components/chat/InboxWorkspace";

export const metadata: Metadata = {
  title: "QuickMed Connect | Inbox",
  description:
    "Messenger-style workspace for QuickMed Connect broadcasts, conversations, and prescription timelines.",
};

export default function ChatWorkspacePage() {
  return <InboxWorkspace />;
}
