import { it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock the modules
vi.mock('../src/hash.js', () => ({
  hash: vi.fn().mockReturnValue('mocked-hash-result')
}))

vi.mock('../src/encrypt.js', () => ({
  encrypt: vi.fn().mockReturnValue('mocked-encrypt-result')
}))

vi.mock('../src/decrypt.js', () => ({
  decrypt: vi.fn().mockReturnValue('mocked-decrypt-result')
}))

vi.mock('../src/utils/getCommandLineArguments.js', () => ({
  getCommandLineArguments: vi.fn().mockReturnValue({
    hasMinimumArguments: true,
    action: '',
    data: '',
    key: '',
    salt: '',
    legacySeed: ''
  })
}))

// Import the mocked modules
import { hash } from '../src/hash.js'
import { encrypt } from '../src/encrypt.js'
import { decrypt } from '../src/decrypt.js'
import { getCommandLineArguments } from '../src/utils/getCommandLineArguments.js'

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

it('Should correctly route "hash" action to processHash function', async () => {
  // Setup command line arguments
  (getCommandLineArguments as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    hasMinimumArguments: true,
    action: 'hash',
    data: 'test-data',
    key: '',
    salt: '',
    legacySeed: ''
  })
  
  // Re-import index.js to execute the code with our mocks
  await import('../src/index.js')
  
  // Verify that hash was called with the correct arguments
  expect(hash).toHaveBeenCalledWith('test-data')
})

it('Should correctly route "encrypt" action to processEncrypt function', async () => {
  // Setup command line arguments
  (getCommandLineArguments as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    hasMinimumArguments: true,
    action: 'encrypt',
    data: 'test-data',
    key: 'test-key',
    salt: 'test-salt',
    legacySeed: ''
  })
  
  // Re-import index.js to execute the code with our mocks
  await import('../src/index.js')
  
  // Verify that encrypt was called with the correct arguments
  expect(encrypt).toHaveBeenCalledWith('test-data', 'test-key', 'test-salt')
})

it('Should correctly route "decrypt" action to processDecrypt function', async () => {
  // Setup command line arguments
  (getCommandLineArguments as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    hasMinimumArguments: true,
    action: 'decrypt',
    data: 'encrypted-data',
    key: 'test-key',
    salt: 'test-salt',
    legacySeed: ''
  })
  
  // Re-import index.js to execute the code with our mocks
  await import('../src/index.js')
  
  // Verify that decrypt was called with the correct arguments
  expect(decrypt).toHaveBeenCalledWith('encrypted-data', 'test-key', {
    legacySeed: '',
    salt: 'test-salt'
  })
})