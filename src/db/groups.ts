import { db } from './schema';
import type { GroupRecord } from './types';

export async function addGroup(name: string, color?: string): Promise<GroupRecord> {
  const record: GroupRecord = {
    id: crypto.randomUUID(),
    name,
    color,
    createdAt: Date.now(),
  };
  await db.groups.add(record);
  return record;
}

export async function getAllGroups() {
  return db.groups.orderBy('createdAt').toArray();
}

export async function renameGroup(id: string, name: string) {
  await db.groups.update(id, { name });
}

export async function deleteGroup(id: string) {
  await db.transaction('rw', db.groups, db.backgrounds, async () => {
    await db.groups.delete(id);

    const affected = await db.backgrounds.where('groups').equals(id).toArray();
    await Promise.all(
      affected.map((bg) =>
        db.backgrounds.update(bg.id, {
          groups: bg.groups.filter((g) => g !== id),
        })
      )
    );
  });
}
