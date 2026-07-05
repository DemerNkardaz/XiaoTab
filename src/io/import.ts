// src/io/import.ts
import JSZip from 'jszip';
import { db } from '@/db/schema';
import type { ExportManifest, SerializedIconRef } from './types';
import type {
  IconRef,
  BackgroundRecord,
  GroupRecord,
  ProfileRecord,
  LinkCategoryRecord,
  LinkRecord,
} from '@/db/types';

async function deserializeIcon(
  zip: JSZip,
  icon: SerializedIconRef | undefined
): Promise<IconRef | undefined> {
  if (!icon) return undefined;
  if (icon.kind === 'builtin') return icon;

  const file = zip.file(icon.assetPath);
  if (!file) throw new Error(`Файл отсутствует в архиве: ${icon.assetPath}`);
  const blob = await file.async('blob');
  return { kind: 'blob', blob };
}

export interface ImportResult {
  profiles: number;
  groups: number;
  backgrounds: number;
  linkCategories: number;
  links: number;
}

export async function importAll(file: File | Blob): Promise<ImportResult> {
  const zip = await JSZip.loadAsync(file);

  const manifestFile = zip.file('manifest.json');
  if (!manifestFile) {
    throw new Error('Некорректный файл резервной копии: отсутствует manifest.json');
  }

  const manifest: ExportManifest = JSON.parse(await manifestFile.async('string'));

  if (manifest.exportVersion > 1) {
    // на будущее — тут появится ветвление под старые/новые версии формата
    throw new Error(`Неподдерживаемая версия резервной копии: ${manifest.exportVersion}`);
  }

  const backgroundRecords: BackgroundRecord[] = await Promise.all(
    manifest.backgrounds.map(async (bg) => {
      const assetFile = zip.file(bg.assetPath);
      if (!assetFile) throw new Error(`Файл отсутствует в архиве: ${bg.assetPath}`);
      const blob = await assetFile.async('blob');
      return {
        id: bg.id,
        blob,
        mimeType: bg.mimeType,
        sourcePath: bg.sourcePath,
        hash: bg.hash,
        groups: bg.groups,
        width: bg.width,
        height: bg.height,
        createdAt: bg.createdAt,
      };
    })
  );

  const linkCategoryRecords: LinkCategoryRecord[] = await Promise.all(
    manifest.linkCategories.map(async (cat) => ({
      id: cat.id,
      profileId: cat.profileId,
      name: cat.name,
      icon: await deserializeIcon(zip, cat.icon),
      position: cat.position,
      createdAt: cat.createdAt,
    }))
  );

  const linkRecords: LinkRecord[] = await Promise.all(
    manifest.links.map(async (link) => ({
      id: link.id,
      profileId: link.profileId,
      url: link.url,
      title: link.title,
      icon: (await deserializeIcon(zip, link.icon))!,
      categoryId: link.categoryId,
      position: link.position,
      createdAt: link.createdAt,
    }))
  );

  const groupRecords: GroupRecord[] = manifest.groups;
  const profileRecords: ProfileRecord[] = manifest.profiles;

  await db.transaction(
    'rw',
    [db.profiles, db.groups, db.backgrounds, db.linkCategories, db.links, db.appSettings],
    async () => {
      await Promise.all([
        db.profiles.clear(),
        db.groups.clear(),
        db.backgrounds.clear(),
        db.linkCategories.clear(),
        db.links.clear(),
      ]);

      await db.profiles.bulkAdd(profileRecords);
      await db.groups.bulkAdd(groupRecords);
      await db.backgrounds.bulkAdd(backgroundRecords);
      await db.linkCategories.bulkAdd(linkCategoryRecords);
      await db.links.bulkAdd(linkRecords);

      await db.appSettings.put({ id: 'app', ...manifest.appSettings });
    }
  );

  return {
    profiles: profileRecords.length,
    groups: groupRecords.length,
    backgrounds: backgroundRecords.length,
    linkCategories: linkCategoryRecords.length,
    links: linkRecords.length,
  };
}
