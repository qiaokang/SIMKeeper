import { SmsConfig } from '../types';
import { KEEP_ALIVE_TARGET_NUMBER } from '../constants';

/**
 * Formats the phone number to the specific protocol: "0044 7973000186"
 * 1. Replaces leading '0' or '+44' with '0044'
 * 2. Ensures a space between '0044' and the rest of the number
 */
export const formatPhoneNumberForPayload = (phoneNumber: string): string => {
  // Remove all non-digit characters
  let digits = phoneNumber.replace(/\D/g, '');
  
  // Handle UK format (+44 or 44 start)
  if (digits.startsWith('44')) {
    digits = digits.substring(2);
  }
  // Handle Standard UK format (07...)
  else if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  
  // Construct the strictly formatted string "0044 XXXXXXXXXX"
  return `0044 ${digits}`;
};

export const sendKeepAliveSms = async (
  simNumber: string, 
  config: SmsConfig
): Promise<{ success: boolean; message: string }> => {
  if (!config.accountSid || !config.authToken || !config.fromNumber) {
    return { success: false, message: 'Twilio configuration missing. Please check settings.' };
  }

  const body = formatPhoneNumberForPayload(simNumber);
  
  // LOGIC CHECK: We are sending the formatted number TO the Keep Alive Target
  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;
  
  // Create form data for Twilio API
  const formData = new URLSearchParams();
  formData.append('To', KEEP_ALIVE_TARGET_NUMBER);
  formData.append('From', config.fromNumber);
  formData.append('Body', body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${config.accountSid}:${config.authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Twilio Error:', errorData);
      return { 
        success: false, 
        message: `Failed: ${errorData.message || response.statusText}` 
      };
    }

    return { success: true, message: `Sent "${body}" to server.` };
  } catch (error) {
    console.error('Network Error:', error);
    return { success: false, message: 'Network error sending SMS. Check console.' };
  }
};