// frontend/src/App.tsx
import { useEffect, useState } from "react";
import "./styles/joinchat.css";        
import "./styles/chat-shell.css";     
import LoginPage  from "./pages/LoginPage";
import { ChatShell } from "./components/ChatShell";

type AuthState = "loading" | "authenticated" | "unauthenticated";

export interface AuthUser {
  id: number;
  name: string | null;
  email: string;
  avatarUrl?: string | null;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://hive-production-8b78.up.railway.app/";

function App() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });

        const data = await res.json();

        if (data.authenticated && data.user) {
          setUser(data.user);
          setAuthState("authenticated");
        } else {
          setAuthState("unauthenticated");
        }
      } catch (err) {
        console.error("Error verificando sesión", err);
        setAuthState("unauthenticated");
      }
    };

    checkSession();
  }, []);

  
  if (authState === "loading") {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>Verificando sesión...</p>
      </div>
    );
  }

  
  if (authState === "unauthenticated") {
    return <LoginPage />;
  }

  
  return (
    <div className="app-root">
      {user && <ChatShell user={user} />}
    </div>
  );
}

export default App;
