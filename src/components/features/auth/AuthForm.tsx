'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface AuthFormState {
  error?: string;
}

export interface AuthFormProps {
  action: (prevState: AuthFormState | null, formData: FormData) => Promise<AuthFormState | null>;
  pendingLabel: string;
  submitLabel: string;
  isRegister?: boolean;
  footerPrompt: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}

export function AuthForm({
  action,
  pendingLabel,
  submitLabel,
  isRegister = false,
  footerPrompt,
  footerLinkLabel,
  footerLinkHref,
}: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2560&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Centered Modal Form */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
        <div className="bg-background/85 dark:bg-background/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-8 sm:p-10 animate-in zoom-in-95 fade-in duration-500">
          <div className="flex flex-col items-center mb-8 text-center">
            <Link href="/" className="mb-6 flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg?v=13" alt="Pruff Logo" className="h-30 md:h-50 w-auto object-contain dark:invert -mt-8 -mb-14" />
            </Link>
          </div>

          <form className="space-y-5" action={formAction}>
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm text-center font-medium animate-in slide-in-from-top-2">
                {state.error}
              </div>
            )}

            <div className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground tracking-wide ml-1" htmlFor="name">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Juan Pérez"
                      className="h-12 pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/50 text-[15px] rounded-xl transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground tracking-wide ml-1" htmlFor="email">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="ejemplo@pruff.com"
                    className="h-12 pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/50 text-[15px] rounded-xl transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-foreground tracking-wide" htmlFor="password">
                    Contraseña
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="h-12 pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/50 text-[15px] rounded-xl transition-all"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="w-full h-12 text-[15px] font-bold rounded-xl shadow-lg group mt-6 transition-all hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              {isPending ? pendingLabel : submitLabel}
              {!isPending && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-border/50 pt-6">
            <p className="text-sm text-muted-foreground">
              {footerPrompt}{' '}
              <Link href={footerLinkHref} className="font-bold text-primary hover:underline transition-colors">
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
