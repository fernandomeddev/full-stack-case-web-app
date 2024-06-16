export type Task = {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'completed'
    projectId: string;
    taskAlias: string;
    createdAt: string;
};
