import crypto from 'crypto'

/**
 * Generates an MD5 hash of the provided string data.
 * 
 * @param data - The string to be hashed. Must be a non-empty string.
 * @returns A hexadecimal string representation of the MD5 hash.
 * @throws An error if data is empty or not a string.
 */
export function hash (data: string): string {
  if (!data || typeof data !== 'string') {
    throw new Error('Data must be provided as a string for hashing.')
  }
  return crypto.createHash('md5').update(data).digest('hex')
}
