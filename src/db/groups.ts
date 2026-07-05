import { db } from './schema';
import { UNGROUPED_GROUP_ID } from './constants';
import type { GroupRecord } from './types';

export interface GroupOption extends Partial<GroupRecord> {
  id: string;
  virtual?: boolean;
}

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

export async function getAllGroupOptions(): Promise<GroupOption[]> {
  const groups = await getAllGroups();
  return [{ id: UNGROUPED_GROUP_ID, virtual: true }, ...groups];
}

export async function renameGroup(id: string, name: string) {
  await db.groups.update(id, { name });
}

export async function deleteGroup(id: string) {
  if (id === UNGROUPED_GROUP_ID) {
    throw new Error('Нельзя удалить виртуальную группу "Без группы"');
  }

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
