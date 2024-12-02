import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectChatStore } from "../utils/projectChat";
import "./CreateProject.css";

export default function CreateProject() {
  const navigate = useNavigate();
  const { addProject } = useProjectChatStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Cria o projeto e automaticamente vincula a um chat
    const newProject = addProject({
      id: `project_${Date.now()}`,
      name: formData.name,
      description: formData.description,
    });

    // Redireciona para o chat do projeto
    navigate(`/chat?project=${newProject.id}`);
  };

  return (
    <div className="create-project-container">
      <form onSubmit={handleSubmit} className="create-project-form">
        <h2 className="create-project-title">Criar Novo Projeto</h2>
        
        <div className="form-group">
          <label htmlFor="name">Nome do Projeto</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="form-input"
            placeholder="Digite o nome do projeto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="form-input"
            placeholder="Descreva seu projeto"
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
            Cancelar
          </button>
          <button type="submit" className="btn-create">
            Criar Projeto
          </button>
        </div>
      </form>
    </div>
  );
}
