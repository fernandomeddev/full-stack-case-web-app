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
import { newProject } from "@/api/newProject";
import React from "react";

const newProjectSchema = z.object({
  name: z.string({ required_error: "O nome do projeto é obrigatório" }).min(1,'Nome do projeto é obrigatório').max(50, "O nome do projeto deve ter no máximo 255 caracteres"),
  description: z.string().max(255, "A descrição deve ter no máximo 255 caracteres"),
})
type NewProjectData = z.infer<typeof newProjectSchema>;

export function NewProjectForm( { setOpen }:{ setOpen:React.Dispatch<React.SetStateAction<boolean>> }) {
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const form = useForm<NewProjectData>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  });
  const queryClient = useQueryClient();
  const { mutateAsync: handleAddProjectFn, isPending, isError } = useMutation({
    mutationFn: newProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects']
      })
    }
   });
  // /gateway/project/new
  async function handleAddProject(data: NewProjectData) {
    try {
      await handleAddProjectFn(data);
      toast.success("Projeto criado com sucesso");
      setOpen(false);
    } catch (error: any) {
      const errorMessages = error.response.data.errors.map((e: any) => e.message).join(", ");
      setErrorMessage(errorMessages);
      toast.error(errorMessages);
    }
  }

  return (
    
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(handleAddProject)}>
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Projeto</Label>
          <Input {...form.register('name') } type="text" id="name" />
          {form.formState.errors.name && <span className="text-xs text-red-500">{form.formState.errors.name.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição do projeto</Label>
          <Textarea {...form.register('description') }  id="description" />
          {form.formState.errors.description && <span className="text-xs text-red-500">{form.formState.errors.description.message}</span>}
        </div>
        <Button disabled={form.formState.isSubmitting || isPending } type="submit">Criar Projeto</Button>
        {isError && <span className="text-xs text-red-500 block">{errorMessage}</span>}
      </form>
  )
}
