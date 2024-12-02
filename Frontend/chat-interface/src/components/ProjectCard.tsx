import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/utils";
import "./ProjectCard.css";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: string;
}

export default function ProjectCard({ id, name, description, status }: ProjectCardProps) {
  const navigate = useNavigate();
  const setActiveProject = useProjectStore((state) => state.setActiveProject);

  const handleClick = () => {
    setActiveProject(id);
    navigate(`/chat?project=${id}`);
  };

  return (
    <div
      className="project-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="project-card-header">
        <h3 className="project-card-title">{name}</h3>
        <span className={`project-card-status status-${status.toLowerCase()}`}>
          {status}
        </span>
      </div>
      <p className="project-card-description">{description}</p>
      <div className="project-card-footer">
        <span className="project-card-action">
          Abrir Chat →
        </span>
      </div>
    </div>
  );
}
