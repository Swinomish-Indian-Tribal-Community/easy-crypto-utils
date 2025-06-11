import crypto from 'crypto'

import { getKeyDerivedIV } from './utils/getKeyDerivedIV.js'
import { getLegacyIV } from './utils/getLegacyIV.js'
import { VERSION_TEXT } from './utils/config/defaultTexts.js'

/**
 * Decrypts encrypted data using AES-256 encryption algorithm.
 * Supports both legacy format and newer versioned format (prefixed with the VERSION_TEXT - see utils/config/defaultTexts for actual string).
 * 
 * @param data - The encrypted string to be decrypted. For newer format, this starts with the VERSION_TEXT.
 * @param key - The encryption key used to decrypt the data.
 * @param seedOrSalt - An object containing either a legacy seed (for legacy format) or a salt value (for newer format).
 * @param seedOrSalt.legacySeed - The seed string used for generating the IV in legacy format. Required when decrypting legacy data.
 * @param seedOrSalt.salt - The salt value used for generating the IV in newer format.
 * @returns The decrypted string in plain text.
 * @throws An error if data or key is missing,
 *         if legacy seed is missing for legacy format,
 *         if the salt string is missing for the current format,
 *         or if decryption fails.
 */
export function decrypt (data: string, key: string, seedOrSalt: {legacySeed?: string, salt: string}): string {
  // Make sure that data and key are provided
  if (!data || !key) {
    throw new Error(`Data and key must be provided for decryption.
      example: decrypt --data="ECU-v2<encrypted-data>" --key="your-encryption-key"`)
  }

  // Make sure that the legacySeed is provided if the data is in the legacy format
  const isOriginalVersion = !(data.startsWith(VERSION_TEXT))
  if (isOriginalVersion && !seedOrSalt.legacySeed && !(typeof seedOrSalt.legacySeed === 'string')) {
    throw new Error('A legacy seed string must be provided for decryption of legacy format.')
  } else if (!seedOrSalt.salt &&!(typeof seedOrSalt.salt ==='string')) {
    throw new Error('A salt string must be provided for decryption of the newer format.')
  }

  try {
    // Get the initialization vector (IV) based on the version of the data
    const resizedIV = isOriginalVersion
      ? getLegacyIV(seedOrSalt.legacySeed as string)
      : getKeyDerivedIV(key, seedOrSalt.salt) // Use key-derived IV for new format
    
    // Create the decryption cipher and decrypt the data
    const hashKey = crypto.createHash('sha256').update(key).digest()
    const decipher = crypto.createDecipheriv('aes256', hashKey, resizedIV)
    const msg = []
    const msgArray = isOriginalVersion
      ? [...data]
      : [...data.slice(VERSION_TEXT.length)]
  
    for (let index = 0; index < msgArray.length; index += 2) {
      const element = `${msgArray[index]}${msgArray[index + 1]}`
      msg.push(decipher.update(element, 'hex', 'binary'))
    }
  
    msg.push(decipher.final('binary'))
    const result = msg.join('')
    return result    
  } catch {
    throw new Error('Decryption failed. Please check your data, key, and salt/legacy-seed values.')
  }
}
