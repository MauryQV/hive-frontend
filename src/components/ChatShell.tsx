import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import type { AuthUser } from "../App";
import { JoinChatModal } from "./JoinChatModal";
import { ChatConversation } from "./ChatConversation";
import { FiMessageSquare } from "react-icons/fi";
import "../styles/chat-shell.css";
import "../styles/chatMessage.css";

interface ChatShellProps {
  user: AuthUser;
}

type ChannelKey = "none" | "general";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:3001";

export const ChatShell: React.FC<ChatShellProps> = ({ user }) => {
  const [activeChannel, setActiveChannel] = useState<ChannelKey>("none");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [assignedNickname, setAssignedNickname] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const handleJoinChat = (nickname: string) => {
    const newSocket = io(WS_URL, {
      query: { name: nickname },
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    newSocket.on("nickname-assigned", (data) => {
      setAssignedNickname(data.nickname);
    });

    newSocket.on("history", (history) => {
      setMessages(history);
    });

    newSocket.on("msgToClient", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("system-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  const handleCloseModal = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setIsConnected(false);
    setAssignedNickname("");
    setActiveChannel("none");
    setMessages([]);
  };

  const sendMessage = () => {
    const text = messageInput.trim();
    if (!text || !socket) return;


    const payload = {
        content: text,
        sender: assignedNickname || user.name, // Enviamos el nombre actual
        avatar: user.avatarUrl, // <--- AQUÍ enviamos el avatar del usuario
        userId: user.id 
    };

    // Enviamos el objeto completo, no solo el texto
    socket.emit("msgToServer", payload);
    setMessageInput("");
  };

  return (
    <div className="chat-shell-root">

      {/* SIDEBAR */}
      <aside className="chat-shell-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-circle">
            <FiMessageSquare className="sidebar-logo-icon" />
          </div>
          <div>
            <h1 className="sidebar-title">HIVE</h1>
            <p className="sidebar-subtitle">Chat colaborativo</p>
          </div>
        </div>

        <div className="sidebar-section-label">Canales</div>
        <nav className="sidebar-channels">
          <button
            className={
              activeChannel === "general"
                ? "sidebar-channel sidebar-channel--active"
                : "sidebar-channel"
            }
            onClick={() => setActiveChannel("general")}
          >
            <span className="sidebar-channel-hash">#</span>
            <span>general</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-avatar">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || "U"}
                style={{ width: "100%", height: "100%", borderRadius: "999px" }}
              />
            ) : (
              user.name?.[0]?.toUpperCase()
            )}
          </div>

          <div className="sidebar-user-info">
            <span className="sidebar-user-name">
              {assignedNickname || user.name}
            </span>
            <span className="sidebar-user-email">{user.email}</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="chat-shell-main">
        {activeChannel === "none" && (
          <section className="chat-welcome">
            <h2 className="chat-welcome-title">
              Bienvenido/a a <span>HIVE</span>
            </h2>
            <p className="chat-welcome-text">
              Selecciona el canal <strong>#general</strong> para comenzar.
            </p>
          </section>
        )}

        {activeChannel === "general" && !isConnected && (
          <JoinChatModal
            user={user}
            onClose={handleCloseModal}
            onJoinChat={handleJoinChat}
          />
        )}

        {activeChannel === "general" && isConnected && (
          <>
            <ChatConversation
              messages={messages}
              currentNickname={assignedNickname}
            />

            {/* CAJA DE TEXTO */}
            <div className="chat-input-row">
              <input
                className="chat-input"
                placeholder="Escribe un mensaje..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="chat-send-btn" onClick={sendMessage}>
                Enviar
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
