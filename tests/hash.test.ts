import { it, vi, expect, beforeEach } from 'vitest'
import { VERSION_TEXT } from '../src/utils/config/defaultTexts.js'
import { hash } from '../src/hash.js'

it('should return a valid MD5 hash for a simple string', () => {
  const testString = 'test'
  const expectedHash = '098f6bcd4621d373cade4e832627b4f6' // MD5 hash for 'test'
  
  const result = hash(testString)
  
  expect(result).toEqual(expectedHash)
  expect(result).toHaveLength(32) // MD5 hash is 32 characters in hex format
})

it('should return consistent hash results for identical inputs', () => {
  const testString = 'hello world'
  
  const firstResult = hash(testString)
  const secondResult = hash(testString)
  const thirdResult = hash(testString)
  
  expect(firstResult).toEqual(secondResult)
  expect(secondResult).toEqual(thirdResult)
  expect(firstResult).toEqual('5eb63bbbe01eeed093cb22bb8f5acdc3') // Known MD5 hash for 'hello world'
})

it('should return different hash results for different inputs', () => {
  const firstString = 'apple'
  const secondString = 'orange'
  
  const firstResult = hash(firstString)
  const secondResult = hash(secondString)
  
  expect(firstResult).not.toEqual(secondResult)
  expect(firstResult).toEqual('1f3870be274f6c49b3e31a0c6728957f') // Known MD5 hash for 'apple'
  expect(secondResult).toEqual('fe01d67a002dfa0f3ac084298142eccd') // Known MD5 hash for 'orange'
})
