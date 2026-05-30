export interface ItemRecord {
  id: string;
  provider: string;
  connector: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  executionStatus: string;
  lastUpdatedAt: string | null;
  webhookUrl: string | null;
  error: Record<string, unknown> | null;
  clientUserId: string | null;
  consecutiveFailedLoginAttempts: number;
  statusDetail: Record<string, unknown> | null;
  parameter: Record<string, unknown> | null;
  userAction: Record<string, unknown> | null;
  nextAutoSyncAt: string | null;
  consentExpiresAt: string | null;
  products: string[];
  oauthRedirectUri: string | null;
}

export interface ItemUpdateInput {
  provider?: string | undefined;
  connector?: Record<string, unknown> | null | undefined;
  status?: string | undefined;
  executionStatus?: string | undefined;
  lastUpdatedAt?: string | null | undefined;
  webhookUrl?: string | null | undefined;
  error?: Record<string, unknown> | null | undefined;
  clientUserId?: string | null | undefined;
  consecutiveFailedLoginAttempts?: number | undefined;
  statusDetail?: Record<string, unknown> | null | undefined;
  parameter?: Record<string, unknown> | null | undefined;
  userAction?: Record<string, unknown> | null | undefined;
  nextAutoSyncAt?: string | null | undefined;
  consentExpiresAt?: string | null | undefined;
  products?: string[] | undefined;
  oauthRedirectUri?: string | null | undefined;
}

export interface ItemsRepository {
  list(): Promise<ItemRecord[]>;
  getById(id: string): Promise<ItemRecord | null>;
  updateById(id: string, input: ItemUpdateInput): Promise<ItemRecord | null>;
}
