import { it, vi, expect, beforeEach } from 'vitest'
import { VERSION_TEXT } from '../src/utils/config/defaultTexts.js'
import { encrypt } from '../src/encrypt.js'
it('Should encrypt a string successfully with valid data, key, and salt', () => {
  const testData = 'Hello, World!'
  const testKey = 'test-encryption-key'
  const testSalt = 'test-salt-value'
  
  const encrypted = encrypt(testData, testKey, testSalt)
  
  // Verify the encrypted string starts with the version identifier
  expect(encrypted.startsWith(VERSION_TEXT)).toBe(true)
  
  // Verify the encrypted string is longer than just the version text
  expect(encrypted.length).toBeGreaterThan(VERSION_TEXT.length)
  
  // Verify the encrypted string is different from the original data
  expect(encrypted.slice(VERSION_TEXT.length)).not.toEqual(testData)
  
  // Verify encryption is deterministic (same inputs produce same output)
  const secondEncryption = encrypt(testData, testKey, testSalt)
  expect(encrypted).toEqual(secondEncryption)
})

it('Should produce different encrypted outputs for the same input data with different salt values', () => {
  const testData = 'Hello, World!'
  const testKey = 'test-encryption-key'
  const firstSalt = 'salt-value-1'
  const secondSalt = 'salt-value-2'
  
  const firstEncryption = encrypt(testData, testKey, firstSalt)
  const secondEncryption = encrypt(testData, testKey, secondSalt)
  
  // Verify both encrypted strings start with the version identifier
  expect(firstEncryption.startsWith(VERSION_TEXT)).toBe(true)
  expect(secondEncryption.startsWith(VERSION_TEXT)).toBe(true)
  
  // Verify the encrypted strings are different from each other
  expect(firstEncryption).not.toEqual(secondEncryption)
  
  // Verify that the actual encrypted part (without the version text) is different
  expect(firstEncryption.slice(VERSION_TEXT.length)).not.toEqual(secondEncryption.slice(VERSION_TEXT.length))
})

it('Should produce different encrypted outputs for the same input data with different keys', () => {
  const testData = 'Hello, World!'
  const firstKey = 'first-encryption-key'
  const secondKey = 'second-encryption-key'
  const testSalt = 'test-salt-value'
  
  const firstEncryption = encrypt(testData, firstKey, testSalt)
  const secondEncryption = encrypt(testData, secondKey, testSalt)
  
  // Verify both encrypted strings start with the version identifier
  expect(firstEncryption.startsWith(VERSION_TEXT)).toBe(true)
  expect(secondEncryption.startsWith(VERSION_TEXT)).toBe(true)
  
  // Verify the encrypted strings are different from each other
  expect(firstEncryption).not.toEqual(secondEncryption)
  
  // Verify that the actual encrypted part (without the version text) is different
  expect(firstEncryption.slice(VERSION_TEXT.length)).not.toEqual(secondEncryption.slice(VERSION_TEXT.length))
})

it('Should verify the encrypted output begins with the VERSION_TEXT prefix', () => {
  const testData = 'Test encryption data'
  const testKey = 'encryption-key-for-test'
  const testSalt = 'salt-for-test'
  
  const encrypted = encrypt(testData, testKey, testSalt)
  
  // Verify the encrypted string starts with the version identifier
  expect(encrypted.startsWith(VERSION_TEXT)).toBe(true)
  
  // Additional check to ensure the VERSION_TEXT is properly prepended
  expect(encrypted.indexOf(VERSION_TEXT)).toBe(0)
  
  // Check that the encrypted string is longer than just the VERSION_TEXT
  expect(encrypted.length).toBeGreaterThan(VERSION_TEXT.length)
})
