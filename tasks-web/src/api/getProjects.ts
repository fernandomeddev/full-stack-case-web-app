import { Project } from "@/_types/project"
import { api } from "@/lib/services/api"

export async function getProjects(): Promise<Project[]>{
    const res = await api.get('/gateway/project/list')
    return res.data.data
}