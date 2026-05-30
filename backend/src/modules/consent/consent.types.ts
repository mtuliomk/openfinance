export interface ConsentRecord {
  id: string;
  itemId: string;
  products: string[];
  openFinancePermissionsGranted: string[];
  createdAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
}

export type ConsentCreateInput = ConsentRecord;

export interface ConsentUpdateInput {
  itemId?: string | undefined;
  products?: string[] | undefined;
  openFinancePermissionsGranted?: string[] | undefined;
  createdAt?: string | undefined;
  expiresAt?: string | null | undefined;
  revokedAt?: string | null | undefined;
}

export interface ConsentRepository {
  create(input: ConsentCreateInput): Promise<ConsentRecord>;
  list(): Promise<ConsentRecord[]>;
  getById(id: string): Promise<ConsentRecord | null>;
  updateById(id: string, input: ConsentUpdateInput): Promise<ConsentRecord | null>;
  deleteById(id: string): Promise<boolean>;
}
