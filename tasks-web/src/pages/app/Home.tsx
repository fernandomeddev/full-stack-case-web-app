/* eslint-disable @typescript-eslint/no-explicit-any */
import { Project } from "@/_types/project";
import { deleteProject } from "@/api/deleteProject";
import { NewProjectForm } from "@/components/forms/project/NewProjectForm";
import { UpdateProjectForm } from "@/components/forms/project/UpdateProjectForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

async function getProjects(): Promise<Project[]>{
    const res = await api.get('/gateway/project/list', {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmVybmFuZG8iLCJlbWFpbCI6ImZlZmVAZW1haWwuY29tIiwiaGFzaGVkUGFzc3dvcmQiOiIkMmEkMTAkdTNyYmlCa1BGNEVsbENYZTdZQUZzdW41dHJpakZ4dDhHeTFYRTJGWUxLSjhqd2MxSkJ2M3EiLCJpZCI6IjNhMDRjNmY1LTQ3YmYtNGQzZS1hMzAxLWJhY2Q2MWM4ZDg1MiIsImlhdCI6MTcxODQ4MTk4MSwiZXhwIjoxNzE5MDg2NzgxfQ.w6YXXpQAAbs5cfrePSUYmlPnxccieeD8hE1boMZVdLA`
        }
    })
    return res.data.data
}
export function Home() {
    const [open, setOpen] = React.useState(false)
    const [openUpdate, setOpenUpdate] = React.useState(false)
    const { data: projects, isLoading, isError } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects
    })

    const queryClient = useQueryClient()
    const { mutateAsync: handleDeleteProjectFn, isPending } = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['projects']
            })
        }
    })

    async function handleDeleteProject(projectId: string) {
        try {
            await handleDeleteProjectFn({ projectId });
            toast.success("Projeto excluído com sucesso");
        } catch (error: any) {
            const errrorMessages = error.response.data.errors.map((e: any) => e.message).join(", ");
            toast.error(errrorMessages);
        }
    }



    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError || !projects) {
        return <div>Error</div>
    }
    
    return (
        <div className="py-6 container">
            <div className="grid grid-cols-3 place-items-center w-full">
                <div></div>
                <h1 className="">PROJETOS</h1>
                <Dialog open={open} onOpenChange={setOpen} >
                    <DialogTrigger asChild>
                        <Button>Novo Projeto</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Projeto</DialogTitle>
                            <DialogDescription>Adicione um novo projeto</DialogDescription>
                        </DialogHeader>
                        <div>
                            <NewProjectForm setOpen={setOpen} />
                        </div>
                        <DialogFooter>
                            <DialogClose>Cancelar</DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            {projects.length === 0 && <div>Nenhum projeto encontrado</div>}
            {projects.length > 0 && (
                <div className="mt-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Criado em</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell><Link to={`/project/${project.id}`}>{project.name}</Link></TableCell>
                                    <TableCell><Link to={`/project/${project.id}`}>{project.description}</Link></TableCell>
                                    <TableCell><Link to={`/project/${project.id}`}>{project.created_at}</Link></TableCell>
                                    <TableCell>
                                        <Popover modal>
                                            <PopoverTrigger asChild>
                                                <Button size={'icon'} variant={'outline'}>
                                                    <Ellipsis className="size-4"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="flex flex-col gap-2 w-32">
                                            <Dialog open={openUpdate} onOpenChange={setOpenUpdate} >
                                                <DialogTrigger asChild>
                                                    <Button>Editar</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Editar Projeto</DialogTitle>
                                                        <DialogDescription>Atualizar informações do projeto</DialogDescription>
                                                    </DialogHeader>
                                                    <div>
                                                        <UpdateProjectForm setOpen={setOpenUpdate} project={project} />
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose>Cancelar</DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                                <Button disabled={ isPending } onClick={() => handleDeleteProject(project.id)}>Excluir</Button>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}