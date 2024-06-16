import { Task } from "@/_types/task";
import { UpdateTaskForm } from "@/components/forms/project/UpdateTaskForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React from "react";

export function UpdateTaskModal({ task }: { task: Task }) {
    const [openUpdate, setOpenUpdate] = React.useState(false)
    
    return (
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
    )
}