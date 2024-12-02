import { useState } from "react";
import { CHAT_CATEGORIES, type ChatCategory } from "@/utils/chatStore";
import "./EditChatModal.css";

interface EditChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: { title: string; category: ChatCategory }) => void;
  onDelete: () => void;
  initialTitle: string;
  initialCategory: ChatCategory;
}

export default function EditChatModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialTitle,
  initialCategory,
}: EditChatModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState<ChatCategory>(initialCategory);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, category });
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    onDelete();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Editar Conversa</h2>
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
            <button
              type="button"
              onClick={handleDelete}
              className={`delete-button ${showDeleteConfirm ? "confirm" : ""}`}
            >
              {showDeleteConfirm ? "Confirmar Exclusão" : "Excluir Conversa"}
            </button>
            <div className="right-actions">
              <button type="button" onClick={onClose} className="cancel-button">
                Cancelar
              </button>
              <button type="submit" className="submit-button">
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
