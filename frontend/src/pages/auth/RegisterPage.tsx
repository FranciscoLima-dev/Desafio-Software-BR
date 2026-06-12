import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TextField } from "../../components/form/TextField";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { getApiErrorMessage } from "../../utils/api-error";
import { registerFormSchema, type RegisterFormValues } from "../../utils/auth-validation";

export function RegisterPage() {
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);

    try {
      await createAccount(values);
      toast.success("Cadastro criado com sucesso.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error);
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Criar conta</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Cadastre-se para gerenciar suas tarefas com seguranca.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          autoComplete="name"
          error={errors.name?.message}
          label="Nome"
          type="text"
          {...register("name")}
        />
        <TextField
          autoComplete="email"
          error={errors.email?.message}
          label="Email"
          type="email"
          {...register("email")}
        />
        <TextField
          autoComplete="new-password"
          error={errors.password?.message}
          label="Senha"
          type="password"
          {...register("password")}
        />
        <TextField
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          label="Confirmar senha"
          type="password"
          {...register("confirmPassword")}
        />

        {serverError ? (
          <div className="rounded-md border border-red-400/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {serverError}
          </div>
        ) : null}

        <Button className="w-full" isLoading={isSubmitting} type="submit">
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Ja tem uma conta?{" "}
        <Link className="font-semibold text-emerald-300 hover:text-emerald-200" to="/login">
          Entrar
        </Link>
      </p>
    </section>
  );
}
