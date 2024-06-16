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
import { newTask } from "@/api/newTask";
import React from "react";

const newTaskSchema = z.object({
  title: z.string({ required_error: "O titulo do tarefa é obrigatório" }).min(1,'Titulo do tarefa é obrigatório').max(50, "O titulo do tarefa deve ter no máximo 255 caracteres"),
  description: z.string().max(255, "A descrição deve ter no máximo 255 caracteres"),
})
type NewTaskData = z.infer<typeof newTaskSchema>;

export function NewTaskForm( { setOpen, projectId }:{ setOpen:React.Dispatch<React.SetStateAction<boolean>>, projectId: string}) {
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const form = useForm<NewTaskData>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: {
      title: "",
      description: "",
    }
  });
  const queryClient = useQueryClient();
  const { mutateAsync: handleAddTaskFn, isPending, isError } = useMutation({
    mutationFn: newTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks']
      })
    }
   });
  // /gateway/task/new
  async function handleAddTask(data: NewTaskData) {
    try {
      await handleAddTaskFn({ title: data.title, description: data.description, projectId });
      toast.success("Tarefa criada com sucesso");
      setOpen(false);
    } catch (error: any) {
      const errorMessages = error.response.data.errors.map((e: any) => e.message).join(", ");
      setErrorMessage(errorMessages);
      toast.error(errorMessages);
    }
  }

  return (
    
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(handleAddTask)}>
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
        <Button disabled={form.formState.isSubmitting || isPending } type="submit">Criar Tarefa</Button>
        {isError && <span className="text-xs text-red-500 block">{errorMessage}</span>}
      </form>
  )
}
