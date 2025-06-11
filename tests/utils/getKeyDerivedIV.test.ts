import { it, expect } from 'vitest'

import { getKeyDerivedIV } from '../../src/utils/getKeyDerivedIV'

it('should throw an error if key is undefined', () => {
  const key = undefined as any // Using undefined as key
  const salt = 'test-salt'
  
  // Verify that calling the function with undefined key throws an error
  expect(() => getKeyDerivedIV(key, salt)).toThrowError('Invalid key provided. Key must be a non-empty string.')
})

it('should throw an error if key is an empty string', () => {
  const key = '' // Using an empty string as key
  const salt = 'test-salt'
  
  // Verify that calling the function with an empty string key throws an error
  expect(() => getKeyDerivedIV(key, salt)).toThrowError('Invalid key provided. Key must be a non-empty string.')
})

it('should throw an error if key is not a string', () => {
  const key = 123 as any // Using a number instead of a string
  const salt = 'test-salt'
  
  // Verify that calling the function with a non-string key throws an error
  expect(() => getKeyDerivedIV(key, salt)).toThrowError('Invalid key provided. Key must be a non-empty string.')
})

it('should return a Buffer of exactly 16 bytes length', () => {
  const key = 'some-test-key'
  const salt = 'some-test-salt'
  
  const iv = getKeyDerivedIV(key, salt)
  
  // Verify the output is a Buffer
  expect(iv).toBeInstanceOf(Buffer)
  
  // Verify the buffer length is exactly 16 bytes
  expect(iv.length).toBe(16)
  
  // Additional check to ensure the Buffer is not empty
  expect(iv.toString('hex')).not.toBe('00000000000000000000000000000000')
})

it('should return different IVs for different keys with the same salt', () => {
  const key1 = 'test-key-1'
  const key2 = 'test-key-2'
  const salt = 'test-salt'
  
  // Get IVs using different keys but the same salt
  const iv1 = getKeyDerivedIV(key1, salt)
  const iv2 = getKeyDerivedIV(key2, salt)
  
  // Verify the outputs are Buffers
  expect(iv1).toBeInstanceOf(Buffer)
  expect(iv2).toBeInstanceOf(Buffer)
  
  // Verify both IVs have the expected length
  expect(iv1.length).toBe(16)
  expect(iv2.length).toBe(16)
  
  // Verify that different keys produce different IVs even with the same salt
  expect(iv1.toString('hex')).not.toBe(iv2.toString('hex'))
})

it('should return the same IV for the same key and salt combination', () => {
  const key = 'test-key'
  const salt = 'test-salt'
  
  // Call the function twice with the same inputs
  const firstIV = getKeyDerivedIV(key, salt)
  const secondIV = getKeyDerivedIV(key, salt)
  
  // Verify the outputs are Buffers
  expect(firstIV).toBeInstanceOf(Buffer)
  expect(secondIV).toBeInstanceOf(Buffer)
  
  // Verify both IVs have the expected length
  expect(firstIV.length).toBe(16)
  expect(secondIV.length).toBe(16)
  
  // Verify that both calls produce identical results
  expect(firstIV.toString('hex')).toBe(secondIV.toString('hex'))
})

it('should produce consistent outputs when using Unicode characters in the key', () => {
  const unicodeKey = '密码キー鍵🔑'
  const salt = 'test-salt'
  
  // Call the function twice with the same inputs
  const iv1 = getKeyDerivedIV(unicodeKey, salt)
  const iv2 = getKeyDerivedIV(unicodeKey, salt)
  
  // Verify the output is a Buffer of expected length
  expect(iv1).toBeInstanceOf(Buffer)
  expect(iv1.length).toBe(16)
  
  // Verify that multiple calls with the same input produce identical results
  expect(iv1.toString('hex')).toBe(iv2.toString('hex'))
  
  // Compare with a different Unicode key to ensure different outputs
  const differentUnicodeKey = '另一个密码キー'
  const differentIV = getKeyDerivedIV(differentUnicodeKey, salt)
  expect(iv1.toString('hex')).not.toBe(differentIV.toString('hex'))
})