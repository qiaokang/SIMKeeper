import { SimCard, SmsConfig } from '../types';
import { STORAGE_KEY_SIMS, STORAGE_KEY_SMS_CONFIG } from '../constants';

// Simulating a Database Access Object (DAO)
export const StorageService = {
  getSims: (): SimCard[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SIMS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("DB Error: Failed to fetch SIMs", e);
      return [];
    }
  },

  saveSims: (sims: SimCard[]): void => {
    localStorage.setItem(STORAGE_KEY_SIMS, JSON.stringify(sims));
  },

  getConfig: (): SmsConfig => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SMS_CONFIG);
      return data ? JSON.parse(data) : { accountSid: '', authToken: '', fromNumber: '', autoSendEnabled: false };
    } catch (e) {
      return { accountSid: '', authToken: '', fromNumber: '', autoSendEnabled: false };
    }
  },

  saveConfig: (config: SmsConfig): void => {
    localStorage.setItem(STORAGE_KEY_SMS_CONFIG, JSON.stringify(config));
  }
};