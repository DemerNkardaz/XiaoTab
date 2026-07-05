import { db } from './schema';
import type { AppSettingsRecord } from './types';

const DEFAULTS: AppSettingsRecord = {
  id: 'app',
  activeProfileId: null,
};

export async function getAppSettings(): Promise<AppSettingsRecord> {
  const existing = await db.appSettings.get('app');
  return existing ?? DEFAULTS;
}

export async function setActiveProfile(profileId: string | null) {
  await db.appSettings.put({ ...(await getAppSettings()), activeProfileId: profileId });
}

export async function updateAppSettings(patch: Partial<Omit<AppSettingsRecord, 'id'>>) {
  const current = await getAppSettings();
  await db.appSettings.put({ ...current, ...patch });
}
