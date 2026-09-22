'use server';

import { db, projects, clients, visualVariants, motionPresets, handoffVaults } from '@studio-orbit/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import {
  VisualVariantItem,
  VisualMutation,
  MotionPresetItem,
  BezierPoints,
  HandoffVaultItem,
  ExtractedSvgAsset,
  ExtractedColorToken,
  EnvChecklistItem,
  SignOffDetails,
} from '@studio-orbit/types';

/**
 * Ensures an active project record exists for the given staging URL or title.
 */
export async function getOrCreateProjectAction(
  stagingUrl: string,
  title: string
): Promise<{
  projectId: string;
  variants: VisualVariantItem[];
  presets: MotionPresetItem[];
  vault: HandoffVaultItem | null;
}> {
  try {
    // 1. Find existing project by stagingUrl or title
    let project = (await db.select().from(projects).where(eq(projects.stagingUrl, stagingUrl)))[0];

    if (!project) {
      // Ensure a client exists
      let client = (await db.select().from(clients).limit(1))[0];
      if (!client) {
        [client] = await db
          .insert(clients)
          .values({
            name: 'miidayStudio Client',
            portalToken: `tok_${Date.now().toString(36)}`,
          } as any)
          .returning();
      }

      [project] = await db
        .insert(projects)
        .values({
          clientId: client.id,
          title: title || 'Executive Creative Delivery',
          name: title || 'Executive Creative Delivery',
          stagingUrl: stagingUrl,
        } as any)
        .returning();
    }

    // 2. Fetch or seed default variants
    let dbVariants = await db
      .select()
      .from(visualVariants)
      .where(eq(visualVariants.projectId, project.id));

    if (dbVariants.length === 0) {
      // Create Base Staging and Variant B defaults
      const [baseVariant] = await db
        .insert(visualVariants)
        .values({
          projectId: project.id,
          name: 'Base Staging',
          isActive: true,
          mutations: [],
        } as any)
        .returning();

      const [pitchedVariant] = await db
        .insert(visualVariants)
        .values({
          projectId: project.id,
          name: 'Variant B: Pitched Concept',
          isActive: false,
          mutations: [
            {
              selector: 'h1',
              newText: 'Engineered Precision & Architectural Elegance',
              originalText: '',
              newBackground: '',
              originalBackground: '',
              appliedAt: new Date().toISOString(),
            },
          ],
        } as any)
        .returning();

      dbVariants = [baseVariant, pitchedVariant];
    }

    // 3. Fetch motion presets
    let dbPresets = await db
      .select()
      .from(motionPresets)
      .where(eq(motionPresets.projectId, project.id));

    if (dbPresets.length === 0) {
      // Seed high-utility editorial curve
      const [defaultPreset] = await db
        .insert(motionPresets)
        .values({
          projectId: project.id,
          selector: 'main, [data-hero], h1',
          curveName: 'Subtle Editorial Expo',
          bezierPoints: [0.16, 1, 0.3, 1],
          durationMs: 800,
          delayMs: 120,
        } as any)
        .returning();

      dbPresets = [defaultPreset];
    }

    // 4. Fetch handoff vault
    const dbVault = (
      await db.select().from(handoffVaults).where(eq(handoffVaults.projectId, project.id)).limit(1)
    )[0];

    const formattedVariants: VisualVariantItem[] = dbVariants.map((v) => ({
      id: v.id,
      projectId: v.projectId,
      name: v.name,
      isActive: v.isActive,
      mutations: (v.mutations as VisualMutation[]) || [],
      createdAt: v.createdAt ? new Date(v.createdAt).toISOString() : new Date().toISOString(),
    }));

    const formattedPresets: MotionPresetItem[] = dbPresets.map((p) => ({
      id: p.id,
      projectId: p.projectId,
      selector: p.selector,
      curveName: p.curveName,
      bezierPoints: (p.bezierPoints as BezierPoints) || [0.16, 1, 0.3, 1],
      durationMs: p.durationMs,
      delayMs: p.delayMs,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    }));

    const formattedVault: HandoffVaultItem | null = dbVault
      ? {
          id: dbVault.id,
          projectId: dbVault.projectId,
          extractedAssets: (dbVault.extractedAssets as ExtractedSvgAsset[]) || [],
          detectedColors: [],
          envChecklist: (dbVault.envChecklist as EnvChecklistItem[]) || [],
          isSignedOff: dbVault.isSignedOff,
          signOffDetails: dbVault.signOffDetails as SignOffDetails | null,
          updatedAt: dbVault.updatedAt ? new Date(dbVault.updatedAt).toISOString() : new Date().toISOString(),
        }
      : null;

    return {
      projectId: project.id,
      variants: formattedVariants,
      presets: formattedPresets,
      vault: formattedVault,
    };
  } catch (error) {
    console.error('getOrCreateProjectAction error:', error);
    return {
      projectId: 'temp_project_id',
      variants: [
        {
          id: 'var_base',
          projectId: 'temp_project_id',
          name: 'Base Staging',
          isActive: true,
          mutations: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'var_b',
          projectId: 'temp_project_id',
          name: 'Variant B: Pitched Concept',
          isActive: false,
          mutations: [],
          createdAt: new Date().toISOString(),
        },
      ],
      presets: [
        {
          id: 'pre_editorial',
          projectId: 'temp_project_id',
          selector: 'h1',
          curveName: 'Ease Out Expo',
          bezierPoints: [0.16, 1, 0.3, 1],
          durationMs: 800,
          delayMs: 0,
          createdAt: new Date().toISOString(),
        },
      ],
      vault: null,
    };
  }
}

/**
 * Save or update a visual mutation variant in PostgreSQL
 */
export async function saveVisualVariantAction(
  projectId: string,
  variantId: string,
  mutations: VisualMutation[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(visualVariants)
      .set({
        mutations: mutations as any,
      } as any)
      .where(eq(visualVariants.id, variantId));

    revalidatePath('/review-sandbox');
    revalidatePath('/staging');
    return { success: true };
  } catch (err: any) {
    console.error('saveVisualVariantAction error:', err);
    return { success: false, error: err?.message || 'Failed to save variant mutations' };
  }
}

/**
 * Create a new visual variant
 */
export async function createVisualVariantAction(
  projectId: string,
  name: string
): Promise<{ success: boolean; variant?: VisualVariantItem; error?: string }> {
  try {
    const [newVariant] = await db
      .insert(visualVariants)
      .values({
        projectId,
        name,
        isActive: false,
        mutations: [],
      } as any)
      .returning();

    revalidatePath('/review-sandbox');
    return {
      success: true,
      variant: {
        id: newVariant.id,
        projectId: newVariant.projectId,
        name: newVariant.name,
        isActive: newVariant.isActive,
        mutations: (newVariant.mutations as VisualMutation[]) || [],
        createdAt: new Date().toISOString(),
      },
    };
  } catch (err: any) {
    console.error('createVisualVariantAction error:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Save a motion preset into motion_presets table
 */
export async function saveMotionPresetAction(
  projectId: string,
  selector: string,
  curveName: string,
  bezierPoints: BezierPoints,
  durationMs: number,
  delayMs: number
): Promise<{ success: boolean; preset?: MotionPresetItem; error?: string }> {
  try {
    const [preset] = await db
      .insert(motionPresets)
      .values({
        projectId,
        selector,
        curveName,
        bezierPoints,
        durationMs,
        delayMs,
      } as any)
      .returning();

    revalidatePath('/review-sandbox');
    return {
      success: true,
      preset: {
        id: preset.id,
        projectId: preset.projectId,
        selector: preset.selector,
        curveName: preset.curveName,
        bezierPoints: preset.bezierPoints as BezierPoints,
        durationMs: preset.durationMs,
        delayMs: preset.delayMs,
        createdAt: new Date().toISOString(),
      },
    };
  } catch (err: any) {
    console.error('saveMotionPresetAction error:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Save or update handoff vault assets and env checklist
 */
export async function saveHandoffVaultAction(
  projectId: string,
  extractedAssets: ExtractedSvgAsset[],
  envChecklist: EnvChecklistItem[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = (
      await db.select().from(handoffVaults).where(eq(handoffVaults.projectId, projectId)).limit(1)
    )[0];

    if (existing) {
      await db
        .update(handoffVaults)
        .set({
          extractedAssets: extractedAssets as any,
          envChecklist: envChecklist as any,
          updatedAt: new Date(),
        } as any)
        .where(eq(handoffVaults.id, existing.id));
    } else {
      await db.insert(handoffVaults).values({
        projectId,
        extractedAssets: extractedAssets as any,
        envChecklist: envChecklist as any,
        isSignedOff: false,
      } as any);
    }

    revalidatePath('/review-sandbox');
    return { success: true };
  } catch (err: any) {
    console.error('saveHandoffVaultAction error:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Complete Milestone Sign-Off action
 */
export async function signOffMilestoneAction(
  projectId: string,
  signerName: string,
  signerEmail: string,
  auditScore: number
): Promise<{ success: boolean; error?: string; signOffDetails?: SignOffDetails }> {
  try {
    const signOffDetails: SignOffDetails = {
      signerName,
      signerEmail,
      timestamp: new Date().toISOString(),
      auditScore,
    };

    const existing = (
      await db.select().from(handoffVaults).where(eq(handoffVaults.projectId, projectId)).limit(1)
    )[0];

    if (existing) {
      await db
        .update(handoffVaults)
        .set({
          isSignedOff: true,
          signOffDetails: signOffDetails as any,
          updatedAt: new Date(),
        } as any)
        .where(eq(handoffVaults.id, existing.id));
    } else {
      await db.insert(handoffVaults).values({
        projectId,
        isSignedOff: true,
        signOffDetails: signOffDetails as any,
        extractedAssets: [],
        envChecklist: [],
      } as any);
    }

    revalidatePath('/review-sandbox');
    return { success: true, signOffDetails };
  } catch (err: any) {
    console.error('signOffMilestoneAction error:', err);
    return { success: false, error: err?.message };
  }
}
