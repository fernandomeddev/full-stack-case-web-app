/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteTask } from "@/api/deleteTask";
import { getProjectTasks } from "@/api/getTasks"
import { UpdateTaskModal } from "@/components/features/tasks/updateTaskModal";
import { NewTaskForm } from "@/components/forms/project/NewTaskForm";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner";

export function ProjectTasks() {
    const [open, setOpen] = React.useState(false)
    
    const { projectId } = useParams() as { projectId: string }
    const {data: tasks, isLoading, isError } = useQuery({
        queryKey: ['tasks', projectId],
        queryFn: async () => await getProjectTasks(projectId),
    })

    const queryClient = useQueryClient()
    const { mutateAsync: handleDeleteTaskFn, isPending } = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tasks']
            })
        }
    })

    async function handleDeleteTask(taskId: string) {
        try {
            await handleDeleteTaskFn(taskId);
            toast.success("Projeto excluído com sucesso");
        } catch (error: any) {
            const errrorMessages = error.response.data.errors.map((e: any) => e.message).join(", ");
            toast.error(errrorMessages);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return (
        <div className="py-6 container">
            <div className=" flex items-center justify-between w-full">
                <Link className={buttonVariants({size:'icon'})} to=".."><ChevronLeft className="size-5" /></Link>
                <h1 className="whitespace-nowrap">TAREFAS DO PROJETO</h1>
                <Dialog open={open} onOpenChange={setOpen} >
                    <DialogTrigger asChild>
                        <Button>Adicionar Tarefa</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nova Tarefa</DialogTitle>
                            <DialogDescription>Adicione uma nova tarefa ao projeto</DialogDescription>
                        </DialogHeader>
                        <div>
                            <NewTaskForm projectId={projectId} setOpen={setOpen} />
                        </div>
                        <DialogFooter>
                            <DialogClose>Cancelar</DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className=" mt-10 space-y-4">
                {!tasks || tasks.length === 0 && <div>Nenhuma tarefa encontrada</div>}
                {tasks && tasks?.map((task) => {
                    return (
                        <Card key={task.id}>
                            <CardHeader>
                                <CardTitle>{task.title}</CardTitle>
                                <CardDescription>{task.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <span>
                                    {task.status}
                                </span>
                            </CardContent>
                            <CardFooter className="gap-2 justify-end">
                                <UpdateTaskModal task={task} />
                                <Button disabled={ isPending } onClick={() => handleDeleteTask(task.id)}>Excluir</Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
