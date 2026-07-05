import Dexie from 'dexie';
import { db } from './schema';
import type { LinkCategoryRecord, IconRef } from './types';

export async function addCategory(
  profileId: string,
  name: string,
  icon?: IconRef
): Promise<LinkCategoryRecord> {
  const last = await db.linkCategories
    .where('[profileId+position]')
    .between([profileId, Dexie.minKey], [profileId, Dexie.maxKey])
    .last();

  const record: LinkCategoryRecord = {
    id: crypto.randomUUID(),
    profileId,
    name,
    icon,
    position: (last?.position ?? 0) + 1,
    createdAt: Date.now(),
  };
  await db.linkCategories.add(record);
  return record;
}

export async function getCategoriesForProfile(profileId: string) {
  return db.linkCategories
    .where('[profileId+position]')
    .between([profileId, Dexie.minKey], [profileId, Dexie.maxKey])
    .toArray();
}

export async function updateCategory(
  id: string,
  patch: Partial<Omit<LinkCategoryRecord, 'id' | 'profileId'>>
) {
  await db.linkCategories.update(id, patch);
}

export async function deleteCategory(id: string) {
  await db.transaction('rw', db.linkCategories, db.links, async () => {
    await db.linkCategories.delete(id);
    const affected = await db.links.where('categoryId').equals(id).toArray();
    await Promise.all(affected.map((link) => db.links.update(link.id, { categoryId: null })));
  });
}
