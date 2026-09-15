import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useAuth";
import { extrairMensagemDeErro } from "@/types/api";

import { loginSchema, type LoginFormValues } from "./schema";

export function LoginPage() {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const login = useLogin();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", senha: "", lembrarMe: false },
    });

    function onSubmit(values: LoginFormValues) {
        login.mutate({ email: values.email, senha: values.senha });
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
            {/* Retângulos decorativos dos cantos, como na referência */}
            <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-br-3xl bg-secondary/70" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-tl-3xl bg-secondary/70" />

            <div className="flex w-full max-w-md flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Logo className="h-14 w-14" />
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-foreground">Bem-vindo(a)!</h1>
                        <p className="text-sm text-muted-foreground">Faça login para acessar sua conta</p>
                    </div>
                </div>

                <Card className="w-full">
                    <CardContent className="flex flex-col gap-6 p-8">
                        <p className="text-center text-sm text-muted-foreground">Por favor, insira seus dados</p>

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="voce@exemplo.com"
                                        className="pl-11"
                                        aria-invalid={!!errors.email}
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="senha">Senha</Label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="senha"
                                        type={mostrarSenha ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="pl-11 pr-11"
                                        aria-invalid={!!errors.senha}
                                        {...register("senha")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarSenha(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.senha && <p className="text-xs text-destructive">{errors.senha.message}</p>}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-foreground/80">
                                    <Controller
                                        name="lembrarMe"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                    Lembrar-me
                                </label>
                                <Link to="/esqueci-senha" className="text-foreground/80 underline underline-offset-2">
                                    Esqueci minha senha
                                </Link>
                            </div>

                            {login.isError && (
                                <p className="text-sm text-destructive">{extrairMensagemDeErro(login.error, "Não foi possível entrar. Confira seus dados.")}</p>
                            )}

                            <Button type="submit" size="lg" className="w-full" disabled={login.isPending}>
                                {login.isPending ? "Entrando..." : "Avançar"}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-sm text-muted-foreground">
                    Ainda não tem conta?{" "}
                    <Link to="/cadastro" className="font-semibold text-foreground underline underline-offset-2">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}
