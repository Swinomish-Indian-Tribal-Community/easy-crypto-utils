import { it, expect } from 'vitest'

import { getLegacyIV } from '../../src/utils/getLegacyIV'

it('should create a 16-byte buffer for the IV regardless of input seed length', () => {
  // Test with seeds of different lengths
  const shortSeed = 'a'
  const mediumSeed = 'regular seed'
  const longSeed = 'a very long seed that exceeds the size of the final IV buffer significantly with lots of extra characters'
  
  const shortIV = getLegacyIV(shortSeed)
  const mediumIV = getLegacyIV(mediumSeed)
  const longIV = getLegacyIV(longSeed)
  
  // Verify all IVs are 16-byte buffers
  expect(shortIV).toBeInstanceOf(Buffer)
  expect(mediumIV).toBeInstanceOf(Buffer)
  expect(longIV).toBeInstanceOf(Buffer)
  
  expect(shortIV.length).toBe(16)
  expect(mediumIV.length).toBe(16)
  expect(longIV.length).toBe(16)
  
  // Verify different seeds produce different IVs
  expect(shortIV.equals(mediumIV)).toBe(false)
  expect(mediumIV.equals(longIV)).toBe(false)
  expect(longIV.equals(shortIV)).toBe(false)
})

it('should generate consistent IV output for the same legacySeed input', () => {
  const seed = 'consistent seed value'
  
  const firstIV = getLegacyIV(seed)
  const secondIV = getLegacyIV(seed)
  const thirdIV = getLegacyIV(seed)
  
  expect(firstIV).toBeInstanceOf(Buffer)
  expect(firstIV.length).toBe(16)
  
  // Verify that all IVs generated from the same seed are identical
  expect(firstIV.equals(secondIV)).toBe(true)
  expect(firstIV.equals(thirdIV)).toBe(true)
  expect(secondIV.equals(thirdIV)).toBe(true)
})

it('should handle empty string as legacySeed', () => {
  const iv = getLegacyIV('')
  
  expect(iv).toBeInstanceOf(Buffer)
  expect(iv.length).toBe(16)
  
  // Verify that the IV for empty string is consistent
  const iv2 = getLegacyIV('')
  expect(iv.equals(iv2)).toBe(true)
  
  // Check that empty string produces a different IV than other strings
  const nonEmptyIV = getLegacyIV('some seed')
  expect(iv.equals(nonEmptyIV)).toBe(false)
})

it('should produce different IVs for slightly different legacySeed values', () => {
  const iv1 = getLegacyIV('test seed')
  const iv2 = getLegacyIV('test seed!')
  
  expect(iv1).toBeInstanceOf(Buffer)
  expect(iv2).toBeInstanceOf(Buffer)
  expect(iv1.length).toBe(16)
  expect(iv2.length).toBe(16)
  expect(iv1.equals(iv2)).toBe(false)
})

it('should throw appropriate error when legacySeed is null or undefined', () => {
  // @ts-expect-error Testing with undefined parameter
  expect(() => getLegacyIV(undefined)).toThrow()
  
  // @ts-expect-error Testing with null parameter
  expect(() => getLegacyIV(null)).toThrow()
})