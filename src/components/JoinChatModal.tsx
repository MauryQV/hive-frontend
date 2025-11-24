// frontend/src/components/JoinChatModal.tsx
import { useState } from "react";
import { FiMessageSquare, FiX } from "react-icons/fi";
import type { AuthUser } from "../App";

interface JoinChatModalProps {
  onClose: () => void;
  user: AuthUser;
  onJoinChat: (nickname: string) => void;
}

export const JoinChatModal: React.FC<JoinChatModalProps> = ({ 
  onClose, 
  user,
  onJoinChat 
}) => {
  const [name, setName] = useState(user.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalName = name.trim();
    
    console.log("Entrando al chat con:", finalName || "(vacío - se generará alias)");
    onJoinChat(finalName);
  };

  return (
    <div className="modal-overlay">
      <div className="joinchat-card modal-card">
        {/* BOTÓN X PARA CERRAR */}
        <button className="modal-close-btn" onClick={onClose}>
          <FiX size={22} />
        </button>

        <header className="joinchat-header">
          <div className="joinchat-logo-circle">
            <FiMessageSquare className="joinchat-logo-icon" />
          </div>
          <h1 className="joinchat-brand">HIVE</h1>
          <p className="joinchat-subtitle">Chat colaborativo en tiempo real</p>
        </header>

        <main>
          <div className="joinchat-card-header">
            <div className="joinchat-avatar">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name || "Usuario"} 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    borderRadius: "16px",
                    objectFit: "cover" 
                  }}
                />
              ) : (
                <span className="joinchat-avatar-icon">👥</span>
              )}
            </div>
            <div>
              <h2 className="joinchat-card-title">Únete a la conversación</h2>
              <p className="joinchat-card-subtitle">
                {user.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="joinchat-form">
            <label className="joinchat-label">¿Cómo quieres aparecer en el chat?</label>
            <input
              className="joinchat-input"
              placeholder="Tu nombre o apodo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />

            <div className="joinchat-hint">
              <span className="joinchat-hint-icon">✨</span>
              <span className="joinchat-hint-text">
                {name.trim() 
                  ? `Entrarás al chat como "${name.trim()}"`
                  : "Si dejas vacío este campo, se te asignará un alias automático como Usuario_1234"
                }
              </span>
            </div>

            <button type="submit" className="joinchat-button">
              Entrar al chat
            </button>
          </form>
        </main>

        <footer className="joinchat-footer">
          <span className="joinchat-status-dot" />
          <span>Sistema HIVE v1.0</span>
        </footer>
      </div>
    </div>
  );
};