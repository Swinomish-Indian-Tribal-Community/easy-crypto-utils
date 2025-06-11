import crypto from 'crypto'

/**
 * Generates a 16-byte Initialization Vector (IV) derived from a provided key.
 * 
 * This function creates a unique IV by hashing the key with SHA-256 along with a salt value.
 * The resulting hash is then truncated to 16 bytes to be used as an IV for encryption operations.
 * This approach ensures that each key produces a unique but deterministic IV.
 * 
 * @param key - The encryption key string from which to derive the IV
 * @param salt - A salt value to further secure the derived IV. This value should be unique for each key.
 * @returns A 16-byte Buffer containing the derived IV for use in encryption/decryption operations
 * @throws An error if the provided key is invalid or not a string
 */
export function getKeyDerivedIV(key: string, salt: string) {
  if (!key || (typeof key !== 'string')) {
    throw new Error('Invalid key provided. Key must be a non-empty string.')
  }
  const resizedIV = Buffer.alloc(16)
  const iv = crypto.createHash('sha256')
    // Together, the next two lines create a unique IV based on the key
    // This ensures that the IV is derived from the key, making it unique for each key
    // See: `./getLegacyIV.ts` for the legacy way of getting the IV
    .update(key)
    .update(salt)
    .digest()
  iv.copy(resizedIV)
  return resizedIV
}
