import { requirePageSession } from '@/lib/auth-context';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProfileSettings } from '@/components/features/profile/ProfileSettings';
import { PageShell } from '@/components/layout/PageShell';

export default async function ProfilePage() {
  const session = await requirePageSession();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <PageShell session={session}>
      <ProfileSettings user={user} />
    </PageShell>
  );
}
