export type IdentityInvestorProfile = 'Conservative' | 'Moderate' | 'Aggressive';
export type IdentitySex = 'FEMALE' | 'MALE' | 'OTHER';

export interface IdentityRecord {
  id: string;
  itemId: string;
  birthDate: string | null;
  taxNumber: string | null;
  document: string | null;
  documentType: string | null;
  jobTitle: string | null;
  companyName: string | null;
  fullName: string | null;
  phoneNumbers: Record<string, unknown>[] | null;
  emails: Record<string, unknown>[] | null;
  addresses: Record<string, unknown>[] | null;
  relations: Record<string, unknown>[] | null;
  investorProfile: IdentityInvestorProfile | null;
  establishmentName: string | null;
  establishmentCode: string | null;
  financialRelationships: Record<string, unknown> | null;
  qualifications: Record<string, unknown> | null;
  socialName: string | null;
  sex: IdentitySex | null;
  maritalStatus: Record<string, unknown> | null;
  nationality: Record<string, unknown> | null;
  otherDocuments: Record<string, unknown>[] | null;
  passport: Record<string, unknown> | null;
  incorporationDate: string | null;
  parties: Record<string, unknown>[] | null;
  businessOtherDocuments: Record<string, unknown>[] | null;
  companiesCnpj: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export type IdentityCreateInput = IdentityRecord;

export interface IdentityUpdateInput {
  itemId?: string | undefined;
  birthDate?: string | null | undefined;
  taxNumber?: string | null | undefined;
  document?: string | null | undefined;
  documentType?: string | null | undefined;
  jobTitle?: string | null | undefined;
  companyName?: string | null | undefined;
  fullName?: string | null | undefined;
  phoneNumbers?: Record<string, unknown>[] | null | undefined;
  emails?: Record<string, unknown>[] | null | undefined;
  addresses?: Record<string, unknown>[] | null | undefined;
  relations?: Record<string, unknown>[] | null | undefined;
  investorProfile?: IdentityInvestorProfile | null | undefined;
  establishmentName?: string | null | undefined;
  establishmentCode?: string | null | undefined;
  financialRelationships?: Record<string, unknown> | null | undefined;
  qualifications?: Record<string, unknown> | null | undefined;
  socialName?: string | null | undefined;
  sex?: IdentitySex | null | undefined;
  maritalStatus?: Record<string, unknown> | null | undefined;
  nationality?: Record<string, unknown> | null | undefined;
  otherDocuments?: Record<string, unknown>[] | null | undefined;
  passport?: Record<string, unknown> | null | undefined;
  incorporationDate?: string | null | undefined;
  parties?: Record<string, unknown>[] | null | undefined;
  businessOtherDocuments?: Record<string, unknown>[] | null | undefined;
  companiesCnpj?: string[] | null | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface IdentityRepository {
  create(input: IdentityCreateInput): Promise<IdentityRecord>;
  list(): Promise<IdentityRecord[]>;
  getById(id: string): Promise<IdentityRecord | null>;
  updateById(id: string, input: IdentityUpdateInput): Promise<IdentityRecord | null>;
  deleteById(id: string): Promise<boolean>;
}
