import crypto from 'crypto'

import { getKeyDerivedIV } from './utils/getKeyDerivedIV.js'
import { VERSION_TEXT } from './utils/config/defaultTexts.js'

/**
 * Encrypts a string using AES-256 encryption with a provided key and salt.
 * The function hashes the key using SHA-256 and derives an initialization vector
 * from the key and salt. Each character of the input string is encrypted separately
 * and combined into a single encrypted hex string.
 *
 * @param data - The string data to be encrypted
 * @param key - The encryption key used to secure the data
 * @param salt - A salt value used to derive the initialization vector
 * @returns A hex-encoded string containing the encrypted data prefixed with a version identifier
 * @throws An error when data or key is not provided
 * @throws An error when encryption fails due to invalid inputs or processing errors
 */
export function encrypt (data: string, key: string, salt: string): string {
  if (!data || !key) {
    throw new Error(`Data and key must be provided for encryption.
      example: encrypt --data="Hello, World!" --key="your-encryption-key"`)
  }

  try {
    const hashKey = crypto.createHash('sha256').update(key).digest()
    const cipher = crypto.createCipheriv('aes256', hashKey, getKeyDerivedIV(key, salt))
    const msg = []
    const msgArray = [...data]
  
    msgArray.forEach(function (phrase) {
      msg.push(cipher.update(phrase, 'binary', 'hex'))
    })
  
    msg.push(cipher.final('hex'))
    const result = msg.join('')
    return VERSION_TEXT + result    
  } catch (error) {
    throw new Error('Encryption failed. Please check your data, key, and salt values.')    
  }
}
