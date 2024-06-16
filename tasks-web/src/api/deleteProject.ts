import { api } from "@/lib/services/api";

interface IDeleteProjectRequest {
    projectId: string;
}

export async function deleteProject({ projectId }: IDeleteProjectRequest) {
    await api.delete(`/gateway/project/remove/${projectId}`);
}