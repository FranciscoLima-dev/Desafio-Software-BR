import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido.").toLowerCase(),
  password: z.string().min(1, "Informe sua senha."),
});

export const registerFormSchema = z
  .object({
    name: z.string().trim().min(1, "Informe seu nome."),
    email: z.string().trim().email("Informe um e-mail válido.").toLowerCase(),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem.",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
