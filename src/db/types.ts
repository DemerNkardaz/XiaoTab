export interface GroupRecord {
  id: string;
  name: string;
  color?: string;
  createdAt: number;
}

export type IconRef = { kind: 'builtin'; name: string } | { kind: 'blob'; blob: Blob };

export interface BackgroundRecord {
  id: string;
  blob: Blob;
  mimeType: string;
  sourcePath: string;
  hash: string;
  groups: string[];
  width?: number;
  height?: number;
  createdAt: number;
}

// src/db/types.ts

export interface LinkCategoryRecord {
  id: string;
  profileId: string;
  name: string;
  icon?: IconRef;
  position: number;
  createdAt: number;
}

export interface LinkRecord {
  id: string;
  profileId: string;
  url: string;
  title: string;
  icon: IconRef;
  categoryId: string | null;
  position: number;
  createdAt: number;
}

export interface ProfileRecord {
  id: string;
  name: string;
  activeBackgroundGroupId: string | null;
  createdAt: number;
}

/** Синглтон-запись, id всегда 'app'. */
export interface AppSettingsRecord {
  id: 'app';
  activeProfileId: string | null;
  locale?: string;
}
