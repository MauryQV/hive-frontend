// frontend/src/api/auth.ts
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type MeResponse =
  | {
      authenticated: false;
      user: null;
      debug?: any;
    }
  | {
      authenticated: true;
      user: {
        id: number;
        email: string;
        name: string | null;
        avatarUrl: string | null;
        createdAt: string;
      };
    };

/**
 * Llama al backend para ver si hay sesión activa.
 * Usa cookies de sesión -> credentials: "include".
 */
export async function fetchMe(): Promise<MeResponse> {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include", // MUY IMPORTANTE para que viaje la cookie hive.sid
  });

  if (!res.ok) {
    // si 500 o lo que sea, lo tratamos como "no autenticado"
    return { authenticated: false, user: null };
  }

  return res.json();
}

export function getGoogleLoginUrl(): string {
  return `${API_URL}/auth/login`;
}
