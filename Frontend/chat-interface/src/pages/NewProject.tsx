import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/utils";
import "./NewProject.css";

export default function NewProject() {
  const navigate = useNavigate();
  const addProject = useProjectStore((state) => state.addProject);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject = addProject({
      id: `project_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      status: formData.status,
    });

    console.log("Novo projeto criado:", newProject);
    navigate(`/chat?project=${newProject.id}`);
  };

  return (
    <div className="new-project-container">
      <form onSubmit={handleSubmit} className="new-project-form">
        <div className="new-project-header">
          <h1 className="new-project-title">Novo Projeto</h1>
          <button
            type="button"
            className="new-project-back"
            onClick={() => navigate("/")}
          >
            ← Voltar
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="name">Nome do Projeto</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            placeholder="Digite o nome do projeto"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input"
            placeholder="Descreva seu projeto"
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="form-input"
          >
            <option value="active">Ativo</option>
            <option value="pending">Pendente</option>
            <option value="completed">Concluído</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="form-submit">
            Criar Projeto
          </button>
        </div>
      </form>
    </div>
  );
}
