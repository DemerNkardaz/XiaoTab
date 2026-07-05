import { db } from './schema';
import { UNGROUPED_GROUP_ID } from './constants';

export async function ensureDefaultProfile(): Promise<void> {
  const profilesCount = await db.profiles.count();
  if (profilesCount > 0) return;

  const defaultProfileId = crypto.randomUUID();

  await db.transaction('rw', db.profiles, db.appSettings, async () => {
    await db.profiles.add({
      id: defaultProfileId,
      name: 'Default',
      activeBackgroundGroupId: UNGROUPED_GROUP_ID,
      createdAt: Date.now(),
    });

    await db.appSettings.put({
      id: 'app',
      activeProfileId: defaultProfileId,
    });
  });
}
