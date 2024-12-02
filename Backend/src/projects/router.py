from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
from ..core.database import get_db_connection
from ..auth import get_current_user
from pydantic import BaseModel
from ..database.models import User

router = APIRouter()

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    repository_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

@router.get("/", response_model=List[ProjectResponse])
def get_projects(current_user: User = Depends(get_current_user)):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT id, name, description, repository_url, owner_id, created_at, updated_at 
                   FROM projects 
                   WHERE owner_id = %s
                   ORDER BY created_at DESC""",
                (current_user.id,)
            )
            projects = cur.fetchall()
            return [dict(project) for project in projects]

@router.post("/", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_user)
):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO projects (name, description, repository_url, owner_id) 
                   VALUES (%s, %s, %s, %s) 
                   RETURNING id, name, description, repository_url, owner_id, created_at, updated_at""",
                (project.name, project.description, project.repository_url, current_user.id)
            )
            conn.commit()
            new_project = cur.fetchone()
            return dict(new_project)

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    current_user: User = Depends(get_current_user)
):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Verificar se o projeto existe e pertence ao usuário
            cur.execute(
                "SELECT id FROM projects WHERE id = %s AND owner_id = %s",
                (project_id, current_user.id)
            )
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail="Project not found")
            
            # Atualizar o projeto
            cur.execute(
                """UPDATE projects 
                   SET name = %s, description = %s, repository_url = %s, updated_at = NOW() 
                   WHERE id = %s AND owner_id = %s
                   RETURNING id, name, description, repository_url, owner_id, created_at, updated_at""",
                (project.name, project.description, project.repository_url, project_id, current_user.id)
            )
            conn.commit()
            updated_project = cur.fetchone()
            return dict(updated_project)

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user)
):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Verificar se o projeto existe e pertence ao usuário
            cur.execute(
                "SELECT id FROM projects WHERE id = %s AND owner_id = %s",
                (project_id, current_user.id)
            )
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail="Project not found")
            
            # Deletar o projeto
            cur.execute(
                "DELETE FROM projects WHERE id = %s AND owner_id = %s",
                (project_id, current_user.id)
            )
            conn.commit()
            return {"message": "Project deleted successfully"}
