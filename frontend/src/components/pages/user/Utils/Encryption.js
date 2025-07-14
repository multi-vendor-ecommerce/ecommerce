import CryptoJS from "crypto-js";

/**
 * Encrypts data using AES encryption.
 * @param {any} data - The data to encrypt (can be an object, array, or string).
 * @param {string} secretKey - The secret key used for encryption.
 * @returns {string} - The encrypted data as a string.
 */
export const encryptData = (data, secretKey) => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return encodeURIComponent(ciphertext); 
};


/**
 * Decrypts AES-encrypted data.
 * @param {string} encryptedData - The encrypted data to decrypt.
 * @param {string} secretKey - The secret key used for decryption.
 * @returns {any} - The decrypted data (parsed back to its original form).
 */
export const decryptData = (encryptedData, secretKey) => {
  try {
    // Convert URL-safe string back to Base64
    const base64Encrypted = encryptedData
      .replace(/-/g, "+")  // Replace - with +
      .replace(/_/g, "/")  // Replace _ with /
      .padEnd(encryptedData.length + (4 - (encryptedData.length % 4)) % 4, "="); 

    const bytes = CryptoJS.AES.decrypt(base64Encrypted, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    // console.error("Error decrypting data:", error);
    return null;
  }
};