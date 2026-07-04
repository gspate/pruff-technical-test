'use client'

import { register } from '@/app/actions/auth';
import { AuthForm } from '@/components/features/auth/AuthForm';

export default function RegisterPage() {
  return (
    <AuthForm
      action={register}
      pendingLabel="Creando cuenta..."
      submitLabel="Registrarme"
      footerPrompt="¿Ya tienes cuenta?"
      footerLinkLabel="Ingresa aquí"
      footerLinkHref="/login"
      isRegister
    />
  );
}
