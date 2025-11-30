export const EXPIRY_DAYS = 180;
export const WARNING_DAYS = 30; // Warn when 30 days are left
export const CRITICAL_DAYS = 7;  // Critical when 7 days are left

// The app will attempt to auto-send 3 days before strict expiry to ensure safety
export const AUTO_SEND_BUFFER_DAYS = 3; 

export const MOCK_SIM_ID = 'mock-sim-1';

// Target number for the Keep-Alive message
export const KEEP_ALIVE_TARGET_NUMBER = '+447373000186';

// Storage keys
export const STORAGE_KEY_SIMS = 'giffgaff-sim-keeper-data';
export const STORAGE_KEY_SMS_CONFIG = 'giffgaff-sim-keeper-sms-config';