import { Task } from "./task";

export type Project = {
    id: string;
    projectAlias: string;
    name: string;
    tasks: Task[];
    description: string;
    created_at: string;
};