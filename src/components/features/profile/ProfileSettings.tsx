'use client';

import * as React from 'react';
import { updateProfile, updatePassword } from '@/app/actions/profile';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { SettingRow } from '@/components/features/profile/SettingRow';
import { ModalFormActions } from '@/components/features/profile/ModalFormActions';
import { getDisplayName, getInitial } from '@/lib/formatters';
import { User, Mail, Lock } from 'lucide-react';

interface ProfileSettingsProps {
  user: {
    name?: string | null;
    email: string;
  };
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [activeModal, setActiveModal] = React.useState<'name' | 'email' | 'password' | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form states
  const [name, setName] = React.useState(user.name || '');
  const [email, setEmail] = React.useState(user.email);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const displayName = getDisplayName(user);

  const closeModal = () => {
    setActiveModal(null);
    setError(null);
    setFormErrors({});
    setName(user.name || '');
    setEmail(user.email);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    const res = await updateProfile({ name: name.trim() });
    setLoading(false);

    if (res.success) {
      window.location.reload();
    } else {
      setError(res.error || 'Error al actualizar el nombre');
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || email === user.email) return;

    setLoading(true);
    setError(null);
    const res = await updateProfile({ email: email.trim() });
    setLoading(false);

    if (res.success) {
      window.location.reload();
    } else {
      setError(res.error || 'Error al actualizar el email');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) return;

    let hasErrors = false;
    const errors: Record<string, string> = {};

    if (newPassword.length < 6) {
      errors.newPassword = 'Debe tener al menos 6 caracteres';
      hasErrors = true;
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    const res = await updatePassword(currentPassword, newPassword);
    setLoading(false);

    if (res.success) {
      closeModal();
      alert('Contraseña actualizada correctamente');
    } else {
      if (res.error?.toLowerCase().includes('actual')) {
        setFormErrors({ currentPassword: res.error });
      } else {
        setError(res.error || 'Error al actualizar la contraseña');
      }
    }
  };

  return (
    <>
      <div className="space-y-6 mb-10">
        {/* HEADER CARD */}
        <div className="bg-background border border-border shadow-sm rounded-2xl p-6 md:p-8 flex items-center gap-5">
          <Avatar size="lg" variant="subtle" initial={getInitial(displayName)} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{displayName}</h1>
            <p className="text-muted-foreground mt-1 text-[15px]">{user.email}</p>
          </div>
        </div>

        {/* SETTINGS LIST CARD */}
        <div className="bg-background border border-border shadow-sm rounded-2xl overflow-hidden">
          <div className="p-4 md:px-6 bg-muted/30 border-b border-border">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Ajustes de Cuenta</h2>
          </div>
          <div className="divide-y divide-border">
            <SettingRow
              icon={<User className="w-5 h-5" />}
              label="Nombre Completo"
              value={user.name || 'No configurado'}
              onChangeClick={() => setActiveModal('name')}
            />
            <SettingRow
              icon={<Mail className="w-5 h-5" />}
              label="Correo Electrónico"
              value={user.email}
              onChangeClick={() => setActiveModal('email')}
            />
            <SettingRow
              icon={<Lock className="w-5 h-5" />}
              label="Contraseña"
              value="••••••••"
              valueClassName="tracking-widest"
              onChangeClick={() => setActiveModal('password')}
            />
          </div>
        </div>
      </div>

      {/* MODALS */}
      {activeModal && (
        <Modal
          onClose={closeModal}
          title={
            activeModal === 'name'
              ? 'Cambiar Nombre'
              : activeModal === 'email'
                ? 'Cambiar Email'
                : 'Cambiar Contraseña'
          }
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {activeModal === 'name' && (
            <form onSubmit={handleUpdateName} className="space-y-5 mt-2">
              <div>
                <label className="block text-sm font-medium mb-3">Nombre Completo</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  autoFocus
                />
              </div>
              <ModalFormActions
                onCancel={closeModal}
                submitLabel="Guardar"
                loading={loading}
                disabled={loading || !name.trim()}
              />
            </form>
          )}

          {activeModal === 'email' && (
            <form onSubmit={handleUpdateEmail} className="space-y-5 mt-2">
              <div>
                <label className="block text-sm font-medium mb-3">Nuevo Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nuevo@email.com"
                  autoFocus
                />
              </div>
              <ModalFormActions
                onCancel={closeModal}
                submitLabel="Guardar"
                loading={loading}
                disabled={loading || !email.trim() || email === user.email}
              />
            </form>
          )}

          {activeModal === 'password' && (
            <form onSubmit={handleUpdatePassword} className="space-y-5 mt-2">
              <div>
                <label className="block text-sm font-medium mb-3">Contraseña Actual</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (formErrors.currentPassword) setFormErrors(prev => ({ ...prev, currentPassword: '' }));
                  }}
                  autoFocus
                />
                {formErrors.currentPassword && <p className="text-red-500 text-sm mt-2">{formErrors.currentPassword}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-3">Nueva Contraseña</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (formErrors.newPassword) setFormErrors(prev => ({ ...prev, newPassword: '' }));
                  }}
                />
                {formErrors.newPassword && <p className="text-red-500 text-sm mt-2">{formErrors.newPassword}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-3">Confirmar Nueva Contraseña</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (formErrors.confirmPassword) setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                />
                {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-2">{formErrors.confirmPassword}</p>}
              </div>
              <ModalFormActions
                onCancel={closeModal}
                submitLabel="Actualizar Contraseña"
                loading={loading}
                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              />
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
