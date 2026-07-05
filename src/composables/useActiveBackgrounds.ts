import { computed } from 'vue';
import { getAppSettings } from '@/db/app-settings';
import { getBackgroundsByGroup } from '@/db/backgrounds';
import { UNGROUPED_GROUP_ID } from '@/db/constants';
import { db } from '@/db/schema';
import { useLiveQuery } from './useLiveQuery';

export function useActiveBackgrounds() {
  const { data: appSettings } = useLiveQuery(() => getAppSettings(), {
    id: 'app' as const,
    activeProfileId: null,
  });

  const { data: activeProfile } = useLiveQuery(async () => {
    const settings = await getAppSettings();
    if (!settings.activeProfileId) return null;
    return (await db.profiles.get(settings.activeProfileId)) ?? null;
  }, null);

  const { data: backgrounds } = useLiveQuery(async () => {
    const settings = await getAppSettings();
    if (!settings.activeProfileId) return [];
    const profile = await db.profiles.get(settings.activeProfileId);
    const groupId = profile?.activeBackgroundGroupId ?? UNGROUPED_GROUP_ID;
    return getBackgroundsByGroup(groupId);
  }, []);

  return { appSettings, activeProfile, backgrounds: computed(() => backgrounds.value) };
}
