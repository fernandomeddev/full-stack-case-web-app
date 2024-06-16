import { api } from "@/lib/services/api";

interface IUpdateProjectRequest {
    name: string;
    description: string;
    projectId: string;
}

export async function updateProject({ name, description, projectId }: IUpdateProjectRequest) {
    await api.put(`/gateway/project/update/${projectId}`, {
        name,
        description
    });
}