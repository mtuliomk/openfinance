export type TransactionType = 'DEBIT' | 'CREDIT';
export type TransactionStatus = 'PENDING' | 'POSTED';

export interface TransactionPaymentParticipantDocument {
  value?: string | undefined;
  type?: 'CPF' | 'CNPJ' | undefined;
}

export interface TransactionPaymentParticipant {
  documentNumber?: TransactionPaymentParticipantDocument | undefined;
  name?: string | undefined;
  accountNumber?: string | undefined;
  branchNumber?: string | undefined;
  routingNumber?: string | undefined;
  routingNumberISPB?: string | undefined;
}

export interface TransactionBoletoMetadataResponse {
  digitableLine: string | null;
  barcode: string | null;
  baseAmount: number | null;
  penaltyAmount: number | null;
  interestAmount: number | null;
  discountAmount: number | null;
}

export interface TransactionPaymentData {
  payer?: TransactionPaymentParticipant | undefined;
  receiver?: TransactionPaymentParticipant | undefined;
  receiverReferenceId?: string | undefined;
  paymentMethod?: string | undefined;
  referenceNumber?: string | undefined;
  reason?: string | undefined;
  boletoMetadata: TransactionBoletoMetadataResponse | null;
}

export interface CreditCardMetadata {
  installmentNumber?: number | undefined;
  totalInstallments?: number | undefined;
  totalAmount?: number | undefined;
  payeeMCC?: number | undefined;
  purchaseDate?: string | undefined;
  billId?: string | undefined;
  cardNumber?: string | undefined;
}

export interface TransactionMerchantData {
  name: string;
  businessName: string;
  cnpj: string;
  cnae?: string | undefined;
  category?: string | undefined;
}

export interface TransactionRecord {
  id: string;
  accountId: string;
  date: string;
  description: string;
  descriptionRaw: string | null;
  type: TransactionType;
  amount: number;
  amountInAccountCurrency: number | null;
  balance: number;
  currencyCode: string;
  category: string | null;
  status: TransactionStatus | null;
  providerCode: string | null;
  paymentData: TransactionPaymentData | null;
  creditCardMetadata: CreditCardMetadata | null;
  merchant: TransactionMerchantData | null;
  categoryId: string | null;
  operationType: string | null;
  providerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCreateInput extends Omit<TransactionRecord, 'status' | 'providerCode'> {
  status?: TransactionStatus | null | undefined;
  providerCode?: string | null | undefined;
}

export interface TransactionUpdateInput {
  accountId?: string | undefined;
  date?: string | undefined;
  description?: string | undefined;
  descriptionRaw?: string | null | undefined;
  type?: TransactionType | undefined;
  amount?: number | undefined;
  amountInAccountCurrency?: number | null | undefined;
  balance?: number | undefined;
  currencyCode?: string | undefined;
  category?: string | null | undefined;
  status?: TransactionStatus | null | undefined;
  providerCode?: string | null | undefined;
  paymentData?: TransactionPaymentData | null | undefined;
  creditCardMetadata?: CreditCardMetadata | null | undefined;
  merchant?: TransactionMerchantData | null | undefined;
  categoryId?: string | null | undefined;
  operationType?: string | null | undefined;
  providerId?: string | null | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface TransactionRepository {
  create(input: TransactionCreateInput): Promise<TransactionRecord>;
  list(): Promise<TransactionRecord[]>;
  getById(id: string): Promise<TransactionRecord | null>;
  updateById(id: string, input: TransactionUpdateInput): Promise<TransactionRecord | null>;
  deleteById(id: string): Promise<boolean>;
}
