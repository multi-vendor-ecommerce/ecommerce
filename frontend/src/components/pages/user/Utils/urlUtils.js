import { decryptData } from "./Encryption";

export const getDecryptedProductIdFromURL = (urlPath, secretKey) => {
  try {
    const parts = urlPath.split("/");
    const encodedProductId = parts[parts.length - 1];
    const decodedProductId = decodeURIComponent(decodeURIComponent(encodedProductId));
    return decryptData(decodedProductId, secretKey);
  } catch (error) {
    console.error("Failed to decrypt product ID:", error);
    return null;
  }
};
