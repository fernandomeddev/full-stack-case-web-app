import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/services/api";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/authContext";

const signinSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})
type SigninData = z.infer<typeof signinSchema>;

export function Signin() {
  const { handleSetToken, setLoading } = useAuth();
  const navigate = useNavigate();
  const form = useForm<SigninData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  async function handleSignin(data: SigninData) {
    setLoading(true);
    try {
      const res = await api.post('/public/auth/login', {
        email: data.email,
        password: data.password,
      });
      if (res.data.data) {
        api.defaults.headers.common.Authorization = `Bearer ${res.data.data}`;
        handleSetToken(res.data.data);
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast.error('Erro ao Autenticar usuário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <h2 className=" text-center text-sm text-zinc-500 font-medium">Acessar Painel</h2>
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(handleSignin)}>
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
        <Button disabled={form.formState.isSubmitting} type="submit">Entrar</Button>
      </form>
      <div className="flex items-center justify-center gap-2">
        <span>Ainda não tem cadastro?</span>
        <Link to="/signup" className="text-blue-500 ml-1">Cadastrar</Link>
      </div>
    </div>
  )
}
