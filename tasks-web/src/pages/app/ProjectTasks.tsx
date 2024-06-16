import { getProjectTasks } from "@/api/getTasks"
import { NewTaskForm } from "@/components/forms/project/NewTaskForm";
import { UpdateTaskForm } from "@/components/forms/project/UpdateTaskForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import React from "react";
import { useParams } from "react-router-dom"

export function ProjectTasks() {
    const [open, setOpen] = React.useState(false)
    const [openUpdate, setOpenUpdate] = React.useState(false)
    const { projectId } = useParams() as { projectId: string }
    const queryClient = useQueryClient()
    const {data: tasks, isLoading, isError } = useQuery({
        queryKey: ['tasks', projectId],
        queryFn: () => getProjectTasks(projectId),
    })

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError) {
        return <div>Error</div>
    }
    console.log(tasks)

    return (
        <div className="py-6 container">
            <div className="grid grid-cols-3 place-items-center w-full">
                <div></div>
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
                {tasks && tasks?.map((task) => (
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
                            <Dialog open={openUpdate} onOpenChange={setOpenUpdate} >
                                <DialogTrigger asChild>
                                    <Button>Editar</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Atualizar Tarefa</DialogTitle>
                                        <DialogDescription>Atualize as informações da tarefa</DialogDescription>
                                    </DialogHeader>
                                    <div>
                                        <UpdateTaskForm task={task} setOpen={setOpenUpdate} />
                                    </div>
                                    <DialogFooter>
                                        <DialogClose>Cancelar</DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            
                            <Button>Excluir</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}   