import "../styles/login.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, Building } from "lucide-react";
import { fetchMe, getGoogleLoginUrl } from "../api/auth"; 

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  //HU05: Si ya hay sesión (después del callback de Google), ir directo al chat
  useEffect(() => {
    const checkSession = async () => {
      try {
        const me = await fetchMe();
        if (me.authenticated) {
          // Ya estás logueada -> pasamos(/chat)
          navigate("/chat");
        }
      } catch (err) {
        console.error("Error verificando sesión", err);
      }
    };

    checkSession();
  }, [navigate]);

  //HU05: Lanzar login con Google (redirige al backend)
  const handleGoogleLogin = () => {
    const url = getGoogleLoginUrl();
    window.location.href = url;
  };

  const handleContinueAsGuest = () => {
    navigate("/chat"); 
  };

  return (
    <div className="login-page">
      {/* Encabezado superior */}
      <header className="lp-header">
        <div className="lp-shield-icon">
          <Shield size={38} color="#fff" />
        </div>
        <h1 className="lp-title">HIVE</h1>
        <p className="lp-subtitle">Acceso seguro corporativo</p>
      </header>

      {/* Contenido principal */}
      <main className="lp-main">
        <section className="lp-card">
          {/* Header de la tarjeta */}
          <div className="lp-card-header">
            <div className="lp-card-avatar">
              <User size={20} color="#fff" />
            </div>
            <div className="lp-card-header-texts">
              <h2 className="lp-card-title">Iniciar sesión</h2>
              <p className="lp-card-subtitle">Autenticación IAM corporativa</p>
            </div>
          </div>

          <div className="lp-divider" />

          {/* Botón Google  */}
          <button
            className="lp-google-btn"
            type="button"
            onClick={handleGoogleLogin} 
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="lp-google-logo"
            />
            <span>Continuar con Google</span>
          </button>

          {/* Enlace “Acceso corporativo” con líneas (para HU01 / alias) */}
          <div className="lp-divider-row" onClick={handleContinueAsGuest}>
            <span>Acceso corporativo</span>
          </div>

          {/* Mensaje informativo */}
          <div className="lp-info-box">
            <div className="lp-info-icon">
              <Building size={15} color="#7C3AED" />
            </div>

            <p className="lp-info-text">
              Solo usuarios con cuentas corporativas verificadas pueden acceder
              al sistema HIVE.
            </p>
          </div>
        </section>

        {/* Pill de SSL */}
        <div className="lp-ssl-pill">
          <span className="lp-ssl-dot" />
          <span>Conexión segura SSL/TLS</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="lp-footer">
        Sistema HIVE v1.0 · IAM Corporativo
      </footer>
    </div>
  );
};

export default LoginPage;


