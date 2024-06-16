/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { updateTask } from "@/api/updateTask";
import { Task } from "@/_types/task";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IUpdateTaskForm {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    task: Task
}

const updateTaskSchema = z.object({
  title: z.string({ required_error: "O titulo da tarefa é obrigatório" }).min(1,'Titulo da tarefa é obrigatório').max(50, "O titulo da tarefa deve ter no máximo 255 caracteres"),
  description: z.string().max(255, "A descrição deve ter no máximo 255 caracteres"),
  status: z.enum(['pending', 'completed'])
})
type UpdateTaskData = z.infer<typeof updateTaskSchema>;

export function UpdateTaskForm( { setOpen, task } : IUpdateTaskForm) {
    console.log(task)
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const form = useForm<UpdateTaskData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status
    }
  });
  const queryClient = useQueryClient();
  const { mutateAsync: handleUpdateTaskFn, isPending, isError } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks']
      })
    }
   });
  async function handleUpdateTask(data: UpdateTaskData) {
    try {
      await handleUpdateTaskFn({
        title: data.title,
        description: data.description,
        status: task.status,
        id: task.id
      });
      toast.success("Tarefa Atualizada com sucesso");
      setOpen(false);
    } catch (error: any) {
      const errorMessages = error.response.data.errors.map((e: any) => e.message).join(", ");
      setErrorMessage(errorMessages);
      toast.error(errorMessages);
    }
  }

  return (
    
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(handleUpdateTask)}>
        <div className="space-y-2">
          <Label htmlFor="title">Titulo da Tarefa</Label>
          <Input {...form.register('title') } type="text" id="title" />
          {form.formState.errors.title && <span className="text-xs text-red-500">{form.formState.errors.title.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição da tarefa</Label>
          <Textarea {...form.register('description') }  id="description" />
          {form.formState.errors.description && <span className="text-xs text-red-500">{form.formState.errors.description.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Status</Label>
          <Select {...form.register('status')}>
            <SelectTrigger>
                <SelectValue placeholder='status' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='pending'>Pendente</SelectItem>
                <SelectItem value='completed'>Concluído</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.title && <span className="text-xs text-red-500">{form.formState.errors.title.message}</span>}
        </div>
        <Button disabled={form.formState.isSubmitting || isPending } type="submit">Atualizar</Button>
        {isError && <span className="text-xs text-red-500 block">{errorMessage}</span>}
      </form>
  )
}
