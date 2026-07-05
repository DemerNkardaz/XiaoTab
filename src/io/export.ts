import JSZip from 'jszip';
import { db } from '@/db/schema';
import { getAppSettings } from '@/db/app-settings';
import { extForMime } from './mime';
import { CURRENT_EXPORT_VERSION, type ExportManifest, type SerializedIconRef } from './types';
import type { IconRef } from '@/db/types';

async function serializeIcon(
  zip: JSZip,
  folder: string,
  id: string,
  icon: IconRef | undefined
): Promise<SerializedIconRef | undefined> {
  if (!icon) return undefined;
  if (icon.kind === 'builtin') return icon;

  const ext = extForMime(icon.blob.type);
  const assetPath = `assets/${folder}/${id}.${ext}`;
  zip.file(assetPath, icon.blob);
  return { kind: 'blob', assetPath };
}

export async function exportAll(): Promise<Blob> {
  const zip = new JSZip();

  const [appSettings, profiles, groups, backgrounds, linkCategories, links] = await Promise.all([
    getAppSettings(),
    db.profiles.toArray(),
    db.groups.toArray(),
    db.backgrounds.toArray(),
    db.linkCategories.toArray(),
    db.links.toArray(),
  ]);

  const manifest: ExportManifest = {
    exportVersion: CURRENT_EXPORT_VERSION,
    exportedAt: Date.now(),
    appSettings: { activeProfileId: appSettings.activeProfileId, locale: appSettings.locale },
    profiles,
    groups,
    backgrounds: [],
    linkCategories: [],
    links: [],
  };

  for (const bg of backgrounds) {
    const ext = extForMime(bg.mimeType);
    const assetPath = `assets/backgrounds/${bg.id}.${ext}`;
    zip.file(assetPath, bg.blob);
    manifest.backgrounds.push({
      id: bg.id,
      assetPath,
      mimeType: bg.mimeType,
      sourcePath: bg.sourcePath,
      hash: bg.hash,
      groups: bg.groups,
      width: bg.width,
      height: bg.height,
      createdAt: bg.createdAt,
    });
  }

  for (const cat of linkCategories) {
    const icon = await serializeIcon(zip, 'category-icons', cat.id, cat.icon);
    manifest.linkCategories.push({
      id: cat.id,
      profileId: cat.profileId,
      name: cat.name,
      icon,
      position: cat.position,
      createdAt: cat.createdAt,
    });
  }

  for (const link of links) {
    const icon = (await serializeIcon(zip, 'link-icons', link.id, link.icon)) as SerializedIconRef;
    manifest.links.push({
      id: link.id,
      profileId: link.profileId,
      url: link.url,
      title: link.title,
      icon,
      categoryId: link.categoryId,
      position: link.position,
      createdAt: link.createdAt,
    });
  }

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

export function downloadExport(blob: Blob, filename = `xiaotab-backup-${Date.now()}.zip`) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
