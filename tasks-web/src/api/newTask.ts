import { api } from "@/lib/services/api";

interface INewTaskRequest {
    title: string;
    description: string;
    projectId: string;

}

export async function newTask({ title, description, projectId }: INewTaskRequest) {
    await api.post(`/gateway/project/${projectId}/task`, {
        title,
        description
    });
}