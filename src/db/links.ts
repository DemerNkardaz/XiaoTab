import Dexie from 'dexie';
import { db } from './schema';
import type { LinkRecord, IconRef } from './types';

export async function getLinksForProfile(profileId: string): Promise<LinkRecord[]> {
  return db.links
    .where('[profileId+position]')
    .between([profileId, Dexie.minKey], [profileId, Dexie.maxKey])
    .toArray();
}

export async function getLinksByCategory(
  profileId: string,
  categoryId: string | null
): Promise<LinkRecord[]> {
  const all = await getLinksForProfile(profileId);
  return all.filter((l) => l.categoryId === categoryId).sort((a, b) => a.position - b.position);
}

export async function addLink(params: {
  profileId: string;
  url: string;
  title: string;
  icon: IconRef;
  categoryId?: string | null;
}): Promise<LinkRecord> {
  const last = await db.links
    .where('[profileId+position]')
    .between([params.profileId, Dexie.minKey], [params.profileId, Dexie.maxKey])
    .last();

  const record: LinkRecord = {
    id: crypto.randomUUID(),
    profileId: params.profileId,
    url: params.url,
    title: params.title,
    icon: params.icon,
    categoryId: params.categoryId ?? null,
    position: (last?.position ?? 0) + 1,
    createdAt: Date.now(),
  };
  await db.links.add(record);
  return record;
}

export async function updateLink(id: string, patch: Partial<Omit<LinkRecord, 'id' | 'profileId'>>) {
  await db.links.update(id, patch);
}

export async function deleteLink(id: string) {
  await db.links.delete(id);
}

export async function moveLink(id: string, beforePos: number | null, afterPos: number | null) {
  let newPosition: number;
  if (beforePos === null) newPosition = (afterPos ?? 0) - 1;
  else if (afterPos === null) newPosition = beforePos + 1;
  else newPosition = (beforePos + afterPos) / 2;

  await db.links.update(id, { position: newPosition });

  if (afterPos !== null && beforePos !== null && Math.abs(afterPos - beforePos) < 1e-9) {
    const link = await db.links.get(id);
    if (link) await renormalizePositions(link.profileId);
  }
}

async function renormalizePositions(profileId: string) {
  await db.transaction('rw', db.links, async () => {
    const all = await getLinksForProfile(profileId);
    all.sort((a, b) => a.position - b.position);
    await Promise.all(all.map((link, i) => db.links.update(link.id, { position: i })));
  });
}
