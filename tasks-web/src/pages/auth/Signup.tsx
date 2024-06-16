import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/services/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirm_password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
}).refine(data => data.password === data.confirm_password, { 
  message: "As senhas não coincidem",
});
type SignupData = z.infer<typeof signupSchema>;

export function Signup() {


  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    }
  });

  async function handleRegister(data: SignupData) {
    try {
      await api.post('/public/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirm_password,
      });
      toast.success('Usuário registrado com sucesso');
      form.reset();
    } catch (error) {
      toast.error('Erro ao registrar usuário');
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <h2 className=" text-center text-sm text-zinc-500 font-medium">Registrar Usuário</h2>
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(handleRegister)}>
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input {...form.register('name') } type="text " id="name" />
          {form.formState.errors.name && <span className="text-xs text-red-500">{form.formState.errors.name.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input {...form.register('email') } type="text" id="email" />
          {form.formState.errors.email && <span className="text-xs text-red-500">{form.formState.errors.email.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input {...form.register('password') } type="password" id="password" />
          {form.formState.errors.password && <span className="text-xs text-red-500">{form.formState.errors.password.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirme sua senha</Label>
          <Input {...form.register('confirm_password') }type="password" id="confirm_password" />
          {form.formState.errors.confirm_password && <span className="text-xs text-red-500">{form.formState.errors.confirm_password.message}</span>}
        </div>
        <Button disabled={form.formState.isSubmitting} type="submit">Registrar</Button>
      </form>
      <div className="flex items-center justify-center gap-2">
        <span>Já possui cadastro?</span>
        <Link to="/signin" className="text-blue-500 ml-1">Login</Link>
      </div>
    </div>
  )
}
