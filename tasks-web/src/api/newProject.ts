import { api } from "@/lib/services/api";

interface INewProjectRequest {
    name: string;
    description: string;
}

export async function newProject({ name, description }: INewProjectRequest) {
    await api.post("/gateway/project/new", {
        name,
        description
    });
}