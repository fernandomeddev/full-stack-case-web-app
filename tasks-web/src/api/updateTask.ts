import { api } from "@/lib/services/api";

interface IUpdateTaskRequest {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'completed';
}

export async function updateTask({ title, description, status, id }: IUpdateTaskRequest) {
    await api.put(`/gateway/task/${id}`, {
        title,
        description,
        status
    });
}