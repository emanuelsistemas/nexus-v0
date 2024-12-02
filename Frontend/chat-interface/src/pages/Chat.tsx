import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProjectStore, useAuthStore } from "@/utils";
import ChatInterface from "@/components/ChatInterface";

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { setActiveProject, activeProject } = useProjectStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (projectId) {
      setActiveProject(projectId);
    } else if (!activeProject) {
      navigate("/");
    }
  }, [projectId, isAuthenticated, navigate, setActiveProject, activeProject]);

  if (!isAuthenticated || !activeProject) {
    return null;
  }

  return <ChatInterface />;
}
