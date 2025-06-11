import crypto from 'crypto'

/**
 * Generates a 16-byte initialization vector (IV) from a legacy seed string.
 * This function creates a SHA-256 hash of the provided seed and truncates it to 16 bytes
 * to maintain compatibility with legacy encryption implementations.
 *
 * @param legacySeed - The string seed used to generate the initialization vector.
 *                     This is the text used to produce the legacy IV in the original code.
 * @returns A 16-byte Buffer containing the initialization vector for use in encryption/decryption operations.
 */
export function getLegacyIV(legacySeed: string): Buffer {
  const resizedIV = Buffer.alloc(16)
  const iv = crypto.createHash('sha256')
    .update(legacySeed) // This is the text used to produce the legacy IV used in the original code
    .digest()
  iv.copy(resizedIV)
  return resizedIV
}
