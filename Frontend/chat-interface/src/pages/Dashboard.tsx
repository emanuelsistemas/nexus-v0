import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/utils";
import ProjectCard from "@/components/ProjectCard";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Meus Projetos</h1>
        <button
          className="dashboard-new-project"
          onClick={() => navigate("/new-project")}
        >
          Novo Projeto
        </button>
      </div>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="no-projects">
            <p>Nenhum projeto criado ainda.</p>
            <p>Clique em "Novo Projeto" para começar!</p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              status={project.status}
            />
          ))
        )}
      </div>
    </div>
  );
}
