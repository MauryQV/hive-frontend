// frontend/src/components/ChatConversation.tsx
import React, { useEffect, useRef } from "react";
import { ChatMessageBubble } from "./ChatMessageBubble";
import "../styles/chatMessage.css";

export interface ChatMessage {
  id?: number;
  content: string;
  sender: string;
  avatar?: string;
  userId?: number;
  type?: "system-join" | "system-leave" | "welcome" | "system" | undefined;
}

interface ChatConversationProps {
  messages: ChatMessage[];
  currentNickname: string;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  messages,
  currentNickname,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-conversation-wrapper">

      {/* Header del canal */}
      <header className="chat-conversation-header">
        <span className="chat-conversation-channel-hash">#</span>
        <span className="chat-conversation-channel-name">general</span>
      </header>

      {/* Mensajes */}
      <div className="chat-conversation">
        {messages.map((msg, i) => (
          <ChatMessageBubble
            key={msg.id ?? i}
            content={msg.content}
            sender={msg.sender}
            avatar={msg.avatar}
            isOwn={msg.sender === currentNickname}
            type={msg.type}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
