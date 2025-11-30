export interface SimCard {
  id: string;
  label: string;
  phoneNumber: string;
  lastUsageDate: string; // ISO String
  notes?: string;
}

export interface AiMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum ExpiryStatus {
  SAFE = 'SAFE',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  EXPIRED = 'EXPIRED'
}

export interface SmsConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  autoSendEnabled: boolean;
}