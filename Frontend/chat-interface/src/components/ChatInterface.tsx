import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/utils";
import { useChatStore, type Message, type ChatCategory, CHAT_CATEGORIES } from "@/utils/chatStore";
import NewChatModal from "./NewChatModal";
import EditChatModal from "./EditChatModal";
import ConfirmDialog from "./ConfirmDialog";
import "./ChatInterface.css";

export default function ChatInterface() {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ChatCategory | "all">("all");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const activeProject = useProjectStore((state) => state.activeProject);
  const {
    createConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    getProjectConversations,
    getConversation,
    activeConversationId,
    setActiveConversation,
  } = useChatStore();

  // Buscar conversas do projeto atual
  const conversations = activeProject
    ? getProjectConversations(activeProject.id)
    : [];

  // Filtrar conversas
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || conv.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Buscar conversa ativa
  const activeConversation = activeConversationId
    ? getConversation(activeConversationId)
    : null;

  // Criar uma nova conversa se não houver nenhuma
  useEffect(() => {
    if (activeProject && conversations.length === 0) {
      createConversation(activeProject.id, "Conversa Inicial", "Outros");
    }
  }, [activeProject, conversations.length, createConversation]);

  const handleNewConversation = (title: string, category: ChatCategory) => {
    if (activeProject) {
      createConversation(activeProject.id, title, category);
      setIsNewChatModalOpen(false);
    }
  };

  const handleUpdateConversation = (updates: {
    title: string;
    category: ChatCategory;
  }) => {
    if (activeConversationId) {
      updateConversation(activeConversationId, updates);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteConversation = () => {
    if (activeConversationId) {
      deleteConversation(activeConversationId);
      setIsEditModalOpen(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversationId) return;

    // Adicionar mensagem do usuário
    addMessage(activeConversationId, {
      text: inputMessage,
      sender: "user",
    });

    setInputMessage("");

    // Simular resposta do assistente
    setTimeout(() => {
      addMessage(activeConversationId, {
        text: "Esta é uma resposta simulada do assistente.",
        sender: "assistant",
      });
    }, 1000);
  };

  const handleLogoutConfirm = () => {
    // Limpar todos os dados do localStorage
    localStorage.clear();
    
    // Limpar dados da sessão
    sessionStorage.clear();
    
    // Remover cookies
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Redirecionar para a página de login
    navigate("/login");
  };

  const handleDashboard = () => {
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!activeProject) return null;

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <div className="header-top">
            <button
              onClick={handleDashboard}
              className="nav-button dashboard-button"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="nav-button logout-button"
            >
              Sair
            </button>
          </div>
          <h2 className="project-title">{activeProject.name}</h2>
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="new-chat-button"
          >
            Nova Conversa
          </button>
        </div>

        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar conversas..."
              className="search-input"
            />
          </div>
          <div className="category-filter">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ChatCategory | "all")}
              className="filter-select"
            >
              <option value="all">Todas as categorias</option>
              {CHAT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="conversations-list">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${
                conversation.id === activeConversationId ? "active" : ""
              }`}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <span className="conversation-title">{conversation.title}</span>
              <span className="conversation-category">{conversation.category}</span>
              <span className="conversation-date">
                {formatDate(conversation.updatedAt)}
              </span>
            </div>
          ))}
          {filteredConversations.length === 0 && (
            <div className="no-results">
              <p>Nenhuma conversa encontrada</p>
            </div>
          )}
        </div>
      </div>

      <div className="chat-main">
        {activeConversation ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <h3 className="chat-title">{activeConversation.title}</h3>
                <span className="chat-category">{activeConversation.category}</span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="edit-chat-button"
              >
                Editar
              </button>
            </div>
            <div className="chat-messages">
              {activeConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender === "user" ? "user" : "assistant"}`}
                >
                  <div className="message-content">{message.text}</div>
                  <div className="message-timestamp">
                    {formatDate(message.timestamp)}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="chat-input"
              />
              <button type="submit" className="chat-send-button">
                Enviar
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Selecione uma conversa ou crie uma nova para começar</p>
          </div>
        )}
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onSubmit={handleNewConversation}
      />

      {activeConversation && (
        <EditChatModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateConversation}
          onDelete={handleDeleteConversation}
          initialTitle={activeConversation.title}
          initialCategory={activeConversation.category}
        />
      )}

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Confirmar Logout"
        message="Tem certeza que deseja sair? Você precisará fazer login novamente para acessar o sistema."
        confirmText="Sair"
        cancelText="Cancelar"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        type="danger"
      />
    </div>
  );
}
