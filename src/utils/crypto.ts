
/**
 * Utility functions for end-to-end encryption
 */

// Use the Web Crypto API for encryption/decryption
const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Generates a new encryption key
 */
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
};

/**
 * Exports a CryptoKey to a base64 string that can be stored
 */
export const exportKey = async (key: CryptoKey): Promise<string> => {
  const exportedKey = await window.crypto.subtle.exportKey('raw', key);
  return bufferToBase64(exportedKey);
};

/**
 * Imports a CryptoKey from a base64 string
 */
export const importKey = async (keyData: string): Promise<CryptoKey> => {
  const keyBuffer = base64ToBuffer(keyData);
  return await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypts data with a given key
 */
export const encryptData = async (data: string, key: CryptoKey): Promise<string> => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoder.encode(data)
  );

  // Combine IV and encrypted data and convert to base64
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  return bufferToBase64(combined);
};

/**
 * Decrypts data with a given key
 */
export const decryptData = async (encryptedData: string, key: CryptoKey): Promise<string> => {
  try {
    const encryptedBuffer = base64ToBuffer(encryptedData);
    
    // Extract IV from the beginning of the data
    const iv = encryptedBuffer.slice(0, 12);
    const data = encryptedBuffer.slice(12);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );

    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Converts an ArrayBuffer to a base64 string
 */
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

/**
 * Converts a base64 string to an ArrayBuffer
 */
const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Generates a secure hash of a password using SHA-256
 */
export const hashPassword = async (password: string): Promise<string> => {
  const msgBuffer = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  return bufferToBase64(hashBuffer);
};

/**
 * Generates a one-time password seed for 2FA
 */
export const generateOTPSecret = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 alphabet
  let result = '';
  const randomBytes = window.crypto.getRandomValues(new Uint8Array(16));
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(randomBytes[i] % chars.length);
  }
  return result;
};
