// frontend/src/components/ChatMessageBubble.tsx
import React from "react";
import "../styles/chatMessage.css";

export type MessageType =
  | "system-join"
  | "system-leave"
  | "welcome"
  | "system"
  | undefined;

export interface ChatMessageBubbleProps {
  content: string;
  sender?: string;
  avatar?: string;
  isOwn: boolean;
  type?: MessageType;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  content,
  sender,
  avatar,
  isOwn,
  type,
}) => {
  const initial = sender ? sender[0]?.toUpperCase() : "?";

  const isSystem =
    type === "system-join" ||
    type === "system-leave" ||
    type === "welcome" ||
    type === "system";

  /* ====== SISTEMA (UNIDO / SALIDO / BIENVENIDO) ====== */
  if (isSystem) {
    let className = "system-badge system-badge--join";

    if (type === "system-leave") className = "system-badge system-badge--leave";
    if (type === "welcome") className = "system-badge system-badge--welcome";

    return (
      <div className="bubble-row system">
        <div className={className}>{content}</div>
      </div>
    );
  }

  /* ====== MENSAJES NORMALES ====== */
  return (
    <div className={`bubble-row ${isOwn ? "own" : "other"}`}>
      {!isOwn && sender && (
        <div className="bubble-avatar">
          {avatar ? <img src={avatar} alt={sender} /> : <span>{initial}</span>}
        </div>
      )}

      <div className={`bubble ${isOwn ? "bubble-own" : "bubble-other"}`}>
        {!isOwn && sender && <p className="bubble-sender">{sender}</p>}
        <p className="bubble-content">{content}</p>
      </div>

      {isOwn && sender && (
        <div className="bubble-avatar">
          {avatar ? <img src={avatar} alt={sender} /> : <span>{initial}</span>}
        </div>
      )}
    </div>
  );
};
