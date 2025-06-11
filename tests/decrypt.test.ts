import { it, vi, expect, beforeEach } from 'vitest'
import { VERSION_TEXT } from '../src/utils/config/defaultTexts.js'

// Mocks are hoisted to the top of the file, so we need to define mock implementations
// without referencing variables that haven't been defined yet
vi.mock('crypto', () => {
  return {
    default: {
      createHash: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnThis(),
        digest: vi.fn().mockReturnValue(Buffer.from('mockHashKeyBuffer'))
      }),
      createDecipheriv: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue('decrypted-part'),
        final: vi.fn().mockReturnValue('final-part')
      })
    }
  }
})

vi.mock('../src/utils/getKeyDerivedIV.js', () => ({
  getKeyDerivedIV: vi.fn().mockReturnValue(Buffer.from('0123456789abcdef'))
}))

vi.mock('../src/utils/getLegacyIV.js', () => ({
  getLegacyIV: vi.fn().mockReturnValue(Buffer.from('0123456789abcdef'))
}))

// Import these after the mocks
import crypto from 'crypto'
import { getKeyDerivedIV } from '../src/utils/getKeyDerivedIV.js'
import { getLegacyIV } from '../src/utils/getLegacyIV.js'
import { decrypt } from '../src/decrypt.js'

// Define constants for use in tests
const mockIV = Buffer.from('0123456789abcdef')
const mockHashKey = Buffer.from('mockHashKeyBuffer')
const mockDecipher = {
  update: vi.fn().mockReturnValue('decrypted-part'),
  final: vi.fn().mockReturnValue('final-part')
}

beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks()
  
  // Re-setup the mock implementations if needed
  // This ensures the mocks return the expected values for each test
  vi.mocked(crypto.createHash).mockReturnValue({
    update: vi.fn().mockReturnThis(),
    digest: vi.fn().mockReturnValue(mockHashKey)
  } as any)
  
  vi.mocked(crypto.createDecipheriv).mockReturnValue(mockDecipher as any)
  vi.mocked(getKeyDerivedIV).mockReturnValue(mockIV)
  vi.mocked(getLegacyIV).mockReturnValue(mockIV)
})

it('should successfully decrypt data with valid parameters for the current version format', () => {
  // Arrange
  const key = 'test-encryption-key'
  const salt = 'test-salt-value'
  
  // Create an encrypted string with the VERSION_TEXT prefix
  const encryptedData = `${VERSION_TEXT}ab12cd34ef56`
  
  // Act
  const result = decrypt(encryptedData, key, { salt })
  
  // Assert
  expect(getKeyDerivedIV).toHaveBeenCalledWith(key, salt)
  expect(crypto.createHash).toHaveBeenCalledWith('sha256')
  expect(crypto.createDecipheriv).toHaveBeenCalledWith('aes256', mockHashKey, mockIV)
  expect(mockDecipher.update).toHaveBeenCalledTimes(6) // Called for each 2 characters
  expect(mockDecipher.final).toHaveBeenCalledWith('binary')
  expect(result).toBe('decrypted-part'.repeat(6) + 'final-part') // Adjust based on how many times update is called
})

it('Should successfully decrypt legacy format data when valid legacy seed is provided', () => {
  // This test will need to be modified since we're mocking encrypt
  // For now, let's simulate the behavior
  const key = 'test-encryption-key'
  const legacySeed = 'legacy-seed-value'
  
  // Since encrypt is mocked, we'll create a simulated encrypted string
  const legacyFormatData = 'ab12cd34ef56' // Simulated encrypted data without VERSION_TEXT
  
  // Act
  const decryptedData = decrypt(legacyFormatData, key, { legacySeed, salt: '' })
  
  // Assert
  expect(getLegacyIV).toHaveBeenCalledWith(legacySeed)
  expect(decryptedData).toBe('decrypted-part'.repeat(6) + 'final-part') // Adjust based on how many times update is called
})

it('should throw an error when key parameter is missing or empty', () => {
  // Test with empty key
  expect(() => {
    decrypt('some-encrypted-data', '', { salt: 'some-salt' })
  }).toThrow('Data and key must be provided for decryption.')
  
  // Test with undefined key
  expect(() => {
    decrypt('some-encrypted-data', undefined as unknown as string, { salt: 'some-salt' })
  }).toThrow('Data and key must be provided for decryption.')
})

it('should throw an error when legacy seed is missing for legacy format data', () => {
  // Arrange
  const encryptedData = 'SomeEncryptedData' // Not starting with VERSION_TEXT
  const key = 'test-key'
  const seedOrSalt = { salt: 'test-salt' } // No legacySeed provided

  // Act & Assert
  expect(() => {
    decrypt(encryptedData, key, seedOrSalt)
  }).toThrow('A legacy seed string must be provided for decryption of legacy format.')
})
