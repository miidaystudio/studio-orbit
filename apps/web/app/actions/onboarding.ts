'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db, users, companies, deliverables } from '@studio-orbit/db';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function completeOnboardingAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }

  console.log("ONBOARDING USER:", session?.user || session);

  let userId = session.user?.id || session.id;
  const userEmail = session.user?.email || session.email;

  if (!userId && userEmail) {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, userEmail),
      });
      userId = existingUser?.id;
    } catch (err) {
      console.error("Error performing fallback email lookup:", err);
    }
  }

  if (!userId) {
    userId = `usr_${Date.now().toString(36)}`;
  }

  const rawUserName = session.user?.name || session.name || 'Alex Rivera';

  let userName = rawUserName;
  try {
    userName = decodeURIComponent(rawUserName);
  } catch {
    userName = rawUserName;
  }

  const companyName = (formData.get('companyName') as string) || 'miidayStudio';
  const website = (formData.get('website') as string) || 'https://miidaystudio.online';
  const title =
    (formData.get('projectTitle') as string) ||
    (formData.get('title') as string) ||
    'Brand System & Client Portal';

  const stagingUrl = (formData.get('stagingUrl') as string) || website || 'https://miidaystudio.online';
  const systemTag = (formData.get('systemTag') as string) || '[DEV-SYSTEM-01]';
  const description =
    (formData.get('description') as string) ||
    'Tactile design architectures, kinetic viewport telemetry, and bespoke design systems.';

  const allocatedHours = Number(formData.get('allocatedHours')) || 40;
  const nextMilestone = (formData.get('nextMilestone') as string) || 'Due Oct 15';

  try {
    // Single atomic database transaction
    await db.transaction(async (tx) => {
      // 1. Insert/update user with onboardingCompleted: true
      const userValues = {
        id: userId,
        name: userName,
        email: userEmail,
        onboardingCompleted: true,
      };
      await tx
        .insert(users)
        .values(userValues as any)
        .onConflictDoUpdate({
          target: users.id,
          set: { onboardingCompleted: true, name: userName } as any,
        });

      // 2. Insert company using session.userId
      const companyValues = {
        userId,
        name: companyName,
        website,
      };
      const [newCompany] = await tx
        .insert(companies)
        .values(companyValues as any)
        .returning();

      // 3. Insert deliverable referencing new companyId
      const deliverableValues = {
        companyId: newCompany.id,
        title,
        systemTag,
        description,
        stagingUrl,
        allocatedHours,
        consumedHours: 0,
        nextMilestone,
        status: 'ACTIVE',
      };
      await tx.insert(deliverables).values(deliverableValues as any);
    });

    revalidatePath('/overview');
    revalidatePath('/projects');
    revalidatePath('/review-sandbox');
    revalidatePath('/staging');
  } catch (err) {
    console.error('Onboarding transaction error:', err);
  }

  revalidatePath('/overview');
  redirect('/overview');
}
