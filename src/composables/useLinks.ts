import { computed } from 'vue';
import { getAppSettings } from '@/db/app-settings';
import { getLinksForProfile, addLink, deleteLink, moveLink } from '@/db/links';
import { useLiveQuery } from './useLiveQuery';
import type { IconRef } from '@/db/types';

export function useLinks() {
  const { data: links } = useLiveQuery(async () => {
    const settings = await getAppSettings();
    if (!settings.activeProfileId) return [];
    return getLinksForProfile(settings.activeProfileId);
  }, []);

  async function create(url: string, title: string, icon: IconRef, categoryId?: string | null) {
    const settings = await getAppSettings();
    if (!settings.activeProfileId) return;
    await addLink({ profileId: settings.activeProfileId, url, title, icon, categoryId });
  }

  async function remove(id: string) {
    await deleteLink(id);
  }

  async function move(id: string, beforePos: number | null, afterPos: number | null) {
    await moveLink(id, beforePos, afterPos);
  }

  return { links: computed(() => links.value), create, remove, move };
}
