import { useState } from "react";
import { CHAT_CATEGORIES, type ChatCategory } from "@/utils/chatStore";
import "./NewChatModal.css";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, category: ChatCategory) => void;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onSubmit,
}: NewChatModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ChatCategory>("Frontend");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, category);
    setTitle("");
    setCategory("Frontend");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Nova Conversa</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Digite o título da conversa"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ChatCategory)}
              className="form-select"
              required
            >
              {CHAT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
