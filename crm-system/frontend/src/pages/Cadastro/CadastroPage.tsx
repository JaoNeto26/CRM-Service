import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegistrar } from "@/hooks/useAuth";
import { extrairMensagemDeErro } from "@/types/api";

import { cadastroSchema, type CadastroFormValues } from "./schema";

export function CadastroPage() {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const registrar = useRegistrar();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CadastroFormValues>({
        resolver: zodResolver(cadastroSchema),
        defaultValues: { nome: "", email: "", senha: "", confirmarSenha: "" },
    });

    function onSubmit(values: CadastroFormValues) {
        registrar.mutate({ nome: values.nome, email: values.email, senha: values.senha });
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
            <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-br-3xl bg-secondary/70" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-tl-3xl bg-secondary/70" />

            <div className="flex w-full max-w-md flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Logo className="h-14 w-14" />
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-foreground">Crie sua conta</h1>
                        <p className="text-sm text-muted-foreground">Leva menos de um minuto</p>
                    </div>
                </div>

                <Card className="w-full">
                    <CardContent className="flex flex-col gap-6 p-8">
                        <p className="text-center text-sm text-muted-foreground">Por favor, insira seus dados</p>

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="nome">Nome</Label>
                                <div className="relative">
                                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="nome"
                                        autoComplete="name"
                                        placeholder="Seu nome completo"
                                        className="pl-11"
                                        aria-invalid={!!errors.nome}
                                        {...register("nome")}
                                    />
                                </div>
                                {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
                            </div>

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
                                        autoComplete="new-password"
                                        placeholder="Mínimo de 8 caracteres"
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

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="confirmarSenha"
                                        type={mostrarSenha ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Repita a senha"
                                        className="pl-11"
                                        aria-invalid={!!errors.confirmarSenha}
                                        {...register("confirmarSenha")}
                                    />
                                </div>
                                {errors.confirmarSenha && (
                                    <p className="text-xs text-destructive">{errors.confirmarSenha.message}</p>
                                )}
                            </div>

                            {registrar.isError && (
                                <p className="text-sm text-destructive">
                                    {extrairMensagemDeErro(registrar.error, "Não foi possível concluir o cadastro.")}
                                </p>
                            )}

                            <Button type="submit" className="w-full" disabled={registrar.isPending}>
                                {registrar.isPending ? "Criando conta..." : "Avançar"}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-sm text-muted-foreground">
                    Já tem conta?{" "}
                    <Link to="/login" className="font-semibold text-foreground underline underline-offset-2">
                        Fazer login
                    </Link>
                </p>
            </div>
        </div>
    );
}
