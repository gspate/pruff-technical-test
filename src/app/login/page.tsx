'use client'

import { login } from '@/app/actions/auth';
import { AuthForm } from '@/components/features/auth/AuthForm';

export default function LoginPage() {
  return (
    <AuthForm
      action={login}
      pendingLabel="Iniciando sesión..."
      submitLabel="Ingresar"
      footerPrompt="¿No tienes cuenta?"
      footerLinkLabel="Regístrate"
      footerLinkHref="/register"
    />
  );
}
