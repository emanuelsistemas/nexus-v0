import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./UserAvatar.css";

interface UserAvatarProps {
  username: string;
  email: string;
  onLogout: () => void;
}

interface UserProfile {
  username: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface SystemSettings {
  language: string;
  notifications: boolean;
}

export default function UserAvatar({ username, email, onLogout }: UserAvatarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [error, setError] = useState("");
  
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<UserProfile>({
    username,
    email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [settings, setSettings] = useState<SystemSettings>({
    language: "pt-BR",
    notifications: true,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        avatarRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
        setError("As senhas não coincidem");
        return;
      }

      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8000/api/v1/auth/profile",
        {
          username: profile.username,
          current_password: profile.currentPassword,
          new_password: profile.newPassword,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowProfileModal(false);
      setError("");
      // Recarregar a página para atualizar as informações
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao atualizar perfil");
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8000/api/v1/auth/settings",
        settings,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowSettingsModal(false);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao atualizar configurações");
    }
  };

  return (
    <div className="relative">
      <div
        ref={avatarRef}
        className="terminal-avatar cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="terminal-avatar-initials">{getInitials(username)}</div>
        <span className="terminal-avatar-name">{username}</span>
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="terminal-menu animate-fadeIn"
        >
          <div className="terminal-menu-header">
            <div className="terminal-menu-username">{username}</div>
            <div className="terminal-menu-email">{email}</div>
          </div>
          
          <div className="terminal-menu-items">
            <button
              className="terminal-menu-item"
              onClick={() => {
                setIsMenuOpen(false);
                setShowProfileModal(true);
              }}
            >
              <span className="terminal-menu-icon">👤</span>
              Perfil Usuário
            </button>

            <button
              className="terminal-menu-item"
              onClick={() => {
                setIsMenuOpen(false);
                setShowSettingsModal(true);
              }}
            >
              <span className="terminal-menu-icon">⚙️</span>
              Ajustes do Sistema
            </button>

            <div className="terminal-menu-separator" />

            <button
              className="terminal-menu-item terminal-menu-item-danger"
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
              }}
            >
              <span className="terminal-menu-icon">🚪</span>
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Modal de Perfil */}
      {showProfileModal && (
        <div className="terminal-modal-overlay">
          <div className="terminal-modal animate-slideIn">
            <div className="terminal-modal-header">
              <h2 className="terminal-modal-title">Editar Perfil</h2>
              <button
                className="terminal-modal-close"
                onClick={() => setShowProfileModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div className="terminal-modal-body">
                {error && (
                  <div className="terminal-error p-4 mb-4 animate-shake">
                    {error}
                  </div>
                )}
                <div className="terminal-form-group">
                  <label className="terminal-form-label">Nome de Usuário</label>
                  <input
                    type="text"
                    className="terminal-form-input"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    required
                  />
                </div>
                <div className="terminal-form-group">
                  <label className="terminal-form-label">Email</label>
                  <div className="terminal-form-static">{email}</div>
                  <div className="terminal-form-help">O email não pode ser alterado pois é usado como identificador único.</div>
                </div>
                <div className="terminal-form-group">
                  <label className="terminal-form-label">Senha Atual</label>
                  <input
                    type="password"
                    className="terminal-form-input"
                    value={profile.currentPassword}
                    onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                  />
                </div>
                <div className="terminal-form-group">
                  <label className="terminal-form-label">Nova Senha</label>
                  <input
                    type="password"
                    className="terminal-form-input"
                    value={profile.newPassword}
                    onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                  />
                </div>
                <div className="terminal-form-group">
                  <label className="terminal-form-label">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    className="terminal-form-input"
                    value={profile.confirmPassword}
                    onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
              <div className="terminal-modal-footer">
                <button
                  type="button"
                  className="terminal-button-red px-4 py-2"
                  onClick={() => setShowProfileModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="terminal-button-green px-4 py-2"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Configurações */}
      {showSettingsModal && (
        <div className="terminal-modal-overlay">
          <div className="terminal-modal animate-slideIn">
            <div className="terminal-modal-header">
              <h2 className="terminal-modal-title">Ajustes do Sistema</h2>
              <button
                className="terminal-modal-close"
                onClick={() => setShowSettingsModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateSettings}>
              <div className="terminal-modal-body">
                {error && (
                  <div className="terminal-error p-4 mb-4 animate-shake">
                    {error}
                  </div>
                )}
                <div className="terminal-form-group">
                  <label className="terminal-form-label">Idioma de Resposta IA</label>
                  <select
                    className="terminal-form-input"
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                  </select>
                  <div className="terminal-form-help">
                    Define o idioma padrão que a IA usará para responder suas mensagens.
                  </div>
                </div>
                <div className="terminal-form-group">
                  <label className="terminal-form-label flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    />
                    Ativar Notificações
                  </label>
                  <div className="terminal-form-help">
                    Receba notificações quando houver atualizações importantes no sistema.
                  </div>
                </div>
              </div>
              <div className="terminal-modal-footer">
                <button
                  type="button"
                  className="terminal-button-red px-4 py-2"
                  onClick={() => setShowSettingsModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="terminal-button-green px-4 py-2"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
