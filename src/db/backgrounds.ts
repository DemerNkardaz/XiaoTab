import { db } from './schema';
import { hashBlob } from './hash';
import type { BackgroundRecord } from './types';
import { UNGROUPED_GROUP_ID } from './constants';

export async function addBackground(params: {
  blob: Blob;
  sourcePath: string;
  groups?: string[];
}): Promise<{ record: BackgroundRecord; duplicate: boolean }> {
  const hash = await hashBlob(params.blob);

  const existing = await db.backgrounds.where('hash').equals(hash).first();
  if (existing) {
    if (params.groups?.length) {
      const merged = Array.from(new Set([...existing.groups, ...params.groups]));
      const updated = { ...existing, groups: merged };
      await db.backgrounds.put(updated);
      return { record: updated, duplicate: true };
    }
    return { record: existing, duplicate: true };
  }

  const dims = await getImageDimensions(params.blob).catch(() => undefined);

  const record: BackgroundRecord = {
    id: crypto.randomUUID(),
    blob: params.blob,
    mimeType: params.blob.type,
    sourcePath: params.sourcePath,
    hash,
    groups: params.groups ?? [],
    width: dims?.width,
    height: dims?.height,
    createdAt: Date.now(),
  };

  await db.backgrounds.add(record);
  return { record, duplicate: false };
}

export async function getBackground(id: string) {
  return db.backgrounds.get(id);
}

export async function getBackgroundsByGroup(groupId: string): Promise<BackgroundRecord[]> {
  if (groupId === UNGROUPED_GROUP_ID) {
    return db.backgrounds.filter((bg) => bg.groups.length === 0).toArray();
  }
  return db.backgrounds.where('groups').equals(groupId).toArray();
}

export async function getAllBackgrounds() {
  return db.backgrounds.orderBy('createdAt').toArray();
}

export async function updateBackgroundGroups(id: string, groups: string[]) {
  await db.backgrounds.update(id, { groups });
}

export async function deleteBackground(id: string) {
  await db.backgrounds.delete(id);
}

function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
