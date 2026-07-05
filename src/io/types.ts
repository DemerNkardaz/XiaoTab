export type SerializedIconRef =
  | { kind: 'builtin'; name: string }
  | { kind: 'blob'; assetPath: string };

export interface ExportManifest {
  exportVersion: number;
  exportedAt: number;
  appSettings: { activeProfileId: string | null; locale?: string };
  profiles: Array<{
    id: string;
    name: string;
    activeBackgroundGroupId: string | null;
    createdAt: number;
  }>;
  groups: Array<{ id: string; name: string; color?: string; createdAt: number }>;
  backgrounds: Array<{
    id: string;
    assetPath: string;
    mimeType: string;
    sourcePath: string;
    hash: string;
    groups: string[];
    width?: number;
    height?: number;
    createdAt: number;
  }>;
  linkCategories: Array<{
    id: string;
    profileId: string;
    name: string;
    icon?: SerializedIconRef;
    position: number;
    createdAt: number;
  }>;
  links: Array<{
    id: string;
    profileId: string;
    url: string;
    title: string;
    icon: SerializedIconRef;
    categoryId: string | null;
    position: number;
    createdAt: number;
  }>;
}

export const CURRENT_EXPORT_VERSION = 1;
