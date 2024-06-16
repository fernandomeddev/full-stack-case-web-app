import { Task } from "@/_types/task";
import { api } from "@/lib/services/api";

export async function getProjectTasks(projectId: string): Promise<Task[]> {
    const res = await api.get(`/gateway/project/${projectId}/tasks`);
    return res.data.data;
}