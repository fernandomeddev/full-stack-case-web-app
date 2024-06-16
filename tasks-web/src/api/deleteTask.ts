import { api } from "@/lib/services/api";

export async function deleteTask(id:string) {
    await api.delete(`/gateway/task/${id}`);
}