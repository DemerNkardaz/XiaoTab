import { db } from './schema';
import type { ProfileRecord } from './types';
import { getAppSettings, setActiveProfile } from './app-settings';

export async function createProfile(name: string): Promise<ProfileRecord> {
  const record: ProfileRecord = {
    id: crypto.randomUUID(),
    name,
    activeBackgroundGroupId: null,
    createdAt: Date.now(),
  };
  await db.profiles.add(record);
  return record;
}

export async function getAllProfiles() {
  return db.profiles.orderBy('createdAt').toArray();
}

export async function renameProfile(id: string, name: string) {
  await db.profiles.update(id, { name });
}

export async function setActiveBackgroundGroup(profileId: string, groupId: string | null) {
  await db.profiles.update(profileId, { activeBackgroundGroupId: groupId });
}

export async function deleteProfile(id: string) {
  await db.transaction('rw', db.profiles, db.appSettings, db.links, db.linkCategories, async () => {
    await db.profiles.delete(id);

    // каскадно удаляем ссылки и категории этого профиля
    await db.links.where('profileId').equals(id).delete();
    await db.linkCategories.where('profileId').equals(id).delete();

    const settings = await getAppSettings();
    if (settings.activeProfileId === id) {
      const fallback = await db.profiles.toCollection().first();
      await setActiveProfile(fallback?.id ?? null);
    }
  });
}
