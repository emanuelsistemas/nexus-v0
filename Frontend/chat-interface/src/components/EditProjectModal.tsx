import { useState } from "react";
import "./EditProjectModal.css";

export type ProjectStatus = "active" | "archived" | "completed";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: {
    name: string;
    description: string;
    status: ProjectStatus;
  }) => void;
  onDelete: () => void;
  initialName: string;
  initialDescription: string;
  initialStatus: ProjectStatus;
}

export default function EditProjectModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialName,
  initialDescription,
  initialStatus,
}: EditProjectModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState<ProjectStatus>(initialStatus);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, description, status });
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
        <h2 className="modal-title">Editar Projeto</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Nome do Projeto</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Digite o nome do projeto"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Digite a descrição do projeto"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="form-select"
              required
            >
              <option value="active">Ativo</option>
              <option value="archived">Arquivado</option>
              <option value="completed">Concluído</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleDelete}
              className={`delete-button ${showDeleteConfirm ? "confirm" : ""}`}
            >
              {showDeleteConfirm
                ? "⚠️ Confirmar Exclusão (Perderá TODAS as conversas)"
                : "Excluir Projeto"}
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

          {showDeleteConfirm && (
            <div className="delete-warning">
              <p>
                ⚠️ ATENÇÃO: Esta ação é irreversível! Ao excluir o projeto, você
                perderá:
              </p>
              <ul>
                <li>Todas as conversas do projeto</li>
                <li>Todo o histórico de interações</li>
                <li>Todas as configurações personalizadas</li>
                <li>Todos os dados associados</li>
              </ul>
              <p>
                Clique novamente em "Confirmar Exclusão" se realmente deseja
                excluir este projeto.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
