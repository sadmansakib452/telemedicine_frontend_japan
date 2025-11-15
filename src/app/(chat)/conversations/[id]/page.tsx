import type { Metadata } from "next";
import ConversationDetailWorkspace from "@/components/chat/ConversationDetailWorkspace";

type ConversationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ConversationDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `QuickMed Connect | Conversation ${id}`,
    description:
      "View and manage your conversation with real-time messaging and prescription support.",
  };
}

export default async function ConversationDetailPage({
  params,
}: ConversationDetailPageProps) {
  const { id } = await params;
  return <ConversationDetailWorkspace conversationId={id} />;
}

