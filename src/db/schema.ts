// src/db/schema.ts
import Dexie, { type EntityTable } from 'dexie';
import type {
  BackgroundRecord,
  GroupRecord,
  LinkRecord,
  LinkCategoryRecord,
  ProfileRecord,
  AppSettingsRecord,
} from './types';

class XiaoTabDB extends Dexie {
  backgrounds!: EntityTable<BackgroundRecord, 'id'>;
  groups!: EntityTable<GroupRecord, 'id'>;
  links!: EntityTable<LinkRecord, 'id'>;
  linkCategories!: EntityTable<LinkCategoryRecord, 'id'>;
  profiles!: EntityTable<ProfileRecord, 'id'>;
  appSettings!: EntityTable<AppSettingsRecord, 'id'>;

  constructor() {
    super('xiaotab');

    this.version(1).stores({
      backgrounds: 'id, &hash, *groups, createdAt',
      groups: 'id, &name, createdAt',
      links: 'id, profileId, categoryId, [profileId+position], createdAt',
      linkCategories: 'id, profileId, &[profileId+name], [profileId+position], createdAt',
      profiles: 'id, &name, createdAt',
      appSettings: 'id',
    });

    // this.version(2).stores({ ... }).upgrade(...)
  }
}

export const db = new XiaoTabDB();
