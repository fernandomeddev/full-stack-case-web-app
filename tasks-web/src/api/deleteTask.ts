import { api } from "@/lib/services/api";

export async function updateTask(id:string) {
    await api.put(`/gateway/task/remove/${id}`);
}