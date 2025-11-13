"use client";

import { useMemo, useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

type Message = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  variant: "incoming" | "outgoing";
};

export type Conversation = {
  id: string;
  name: string;
  role: string;
  status: string;
  preview: string;
  timeAgo: string;
  avatar: string;
  online?: boolean;
  messages: Message[];
};

const seeded_conversations: Conversation[] = [
  {
    id: "conv-01",
    name: "Kaiya George",
    role: "Project Manager",
    status: "Reachable",
    preview: "Please confirm tomorrow’s availability...",
    timeAgo: "15 mins",
    avatar: "/images/user/user-01.jpg",
    online: true,
    messages: [
      {
        id: "conv-01-msg-01",
        author: "Kaiya George",
        avatar: "/images/user/user-01.jpg",
        text: "Please confirm tomorrow's availability for a follow-up at 11 AM.",
        time: "Kaiya, 10 mins ago",
        variant: "incoming",
      },
      {
        id: "conv-01-msg-02",
        author: "You",
        avatar: "/images/user/user-12.jpg",
        text: "Noted! I will send the confirmation shortly.",
        time: "5 mins ago",
        variant: "outgoing",
      },
    ],
  },
  {
    id: "conv-02",
    name: "Lindsey Curtis",
    role: "Designer",
    status: "Active now",
    preview: "I want to make an appointment...",
    timeAgo: "30 mins",
    avatar: "/images/user/user-04.jpg",
    online: true,
    messages: [
      {
        id: "conv-02-msg-01",
        author: "Lindsey Curtis",
        avatar: "/images/user/user-04.jpg",
        text: "I want to make an appointment tomorrow from 2:00 to 5:00pm?",
        time: "Lindsey, 2 hours ago",
        variant: "incoming",
      },
      {
        id: "conv-02-msg-02",
        author: "You",
        avatar: "/images/user/user-12.jpg",
        text: "If I don’t like something, I’ll stay away from it.",
        time: "2 hours ago",
        variant: "outgoing",
      },
      {
        id: "conv-02-msg-03",
        author: "Lindsey Curtis",
        avatar: "/images/user/user-04.jpg",
        text: "I want more detailed information.",
        time: "Lindsey, 1 hour ago",
        variant: "incoming",
      },
    ],
  },
  {
    id: "conv-03",
    name: "Zain Geidt",
    role: "Content Writer",
    status: "Away",
    preview: "Any update on the prescription request?",
    timeAgo: "45 mins",
    avatar: "/images/user/user-06.jpg",
    messages: [
      {
        id: "conv-03-msg-01",
        author: "Zain Geidt",
        avatar: "/images/user/user-06.jpg",
        text: "Any update on the prescription request?",
        time: "Zain, 45 mins ago",
        variant: "incoming",
      },
    ],
  },
  {
    id: "conv-04",
    name: "Carla George",
    role: "Front-end Developer",
    status: "Offline",
    preview: "We are waiting on pharmacy confirmation.",
    timeAgo: "2 days",
    avatar: "/images/user/user-08.jpg",
    messages: [
      {
        id: "conv-04-msg-01",
        author: "Carla George",
        avatar: "/images/user/user-08.jpg",
        text: "We are waiting on pharmacy confirmation.",
        time: "Carla, 2 days ago",
        variant: "incoming",
      },
    ],
  },
];

export default function InboxWorkspace() {
  const [activeConversationId, setActiveConversationId] = useState("conv-02");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const conversations = useMemo(() => seeded_conversations, []);
  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) ??
    conversations[0];

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setIsMobileChatOpen(true);
  };

  const handleBackToList = () => {
    setIsMobileChatOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50 px-4 py-6 transition-colors dark:bg-gray-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="grid w-full max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div
          className={`h-[calc(100vh-5rem)] ${
            isMobileChatOpen ? "hidden" : "flex"
          } lg:flex`}
        >
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversation.id}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        <div
          className={`h-[calc(100vh-5rem)] ${
            isMobileChatOpen ? "flex" : "hidden"
          } lg:flex`}
        >
          <ChatWindow
            conversation={activeConversation}
            onBack={handleBackToList}
          />
        </div>
      </div>
    </div>
  );
}

