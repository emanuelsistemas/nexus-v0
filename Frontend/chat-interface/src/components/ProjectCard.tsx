import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/utils";
import EditProjectModal, { ProjectStatus } from "./EditProjectModal";
import "./ProjectCard.css";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectCard({
  id,
  name,
  description,
  status,
  createdAt,
  updatedAt,
}: ProjectCardProps) {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setActiveProject, updateProject, deleteProject } = useProjectStore();

  const handleCardClick = () => {
    setActiveProject({ id, name, description, status, createdAt, updatedAt });
    navigate("/chat");
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async (updates: {
    name: string;
    description: string;
    status: ProjectStatus;
  }) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/v1/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao atualizar projeto");
      }

      updateProject(id, data);
      setIsEditModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar projeto";
      setError(errorMessage);
      console.error("Erro ao atualizar projeto:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/v1/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Erro ao excluir projeto");
      }

      deleteProject(id);
      setIsEditModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir projeto";
      setError(errorMessage);
      console.error("Erro ao excluir projeto:", err);
    } finally {
      setIsLoading(false);
    }
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

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "active":
        return "status-active";
      case "archived":
        return "status-archived";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "archived":
        return "Arquivado";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="project-card" onClick={handleCardClick}>
        <div className="card-header">
          <h3 className="project-name">{name}</h3>
          <button
            onClick={handleEditClick}
            className="edit-button"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Editar"}
          </button>
        </div>
        <p className="project-description">{description}</p>
        <div className="card-footer">
          <span className={`project-status ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
          <div className="project-dates">
            <span className="date-label">Criado: {formatDate(createdAt)}</span>
            <span className="date-label">Atualizado: {formatDate(updatedAt)}</span>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProject}
        onDelete={handleDeleteProject}
        initialName={name}
        initialDescription={description}
        initialStatus={status}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
