import { describe, it, vi, expect } from 'vitest'

// Mock fullInstructions
vi.mock('../../src/utils/instructions.js', () => ({
  fullInstructions: vi.fn()
}))

import { fullInstructions } from '../../src/utils/instructions.js'
import { getCommandLineArguments } from '../../src/utils/getCommandLineArguments.js'

describe('getCommandLineArguments', () => {

  it('should show full instructions and exit when there are only 2 arguments', () => {
    // Save original process.argv and process.exit
    const originalArgv = process.argv
    const exitMock = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
    
    // Mock process.argv with only 2 arguments (node, script)
    process.argv = ['node', 'script.js']
    
    try {
      // Call the function
      getCommandLineArguments()
      
      // Verify fullInstructions was called
      expect(fullInstructions).toHaveBeenCalled()
      
      // Verify exit was called with 1 (failure exit code)
      expect(exitMock).toHaveBeenCalledWith(1)
    } finally {
      // Restore original argv and cleanup mocks
      process.argv = originalArgv
      exitMock.mockRestore()
      vi.resetModules()
    }
  })

  it('should show full instructions and exit when there are only 3 arguments', () => {
    // Save original process.argv and process.exit
    const originalArgv = process.argv
    const exitMock = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
    
    // Mock process.argv with only 3 arguments (node, script, action)
    process.argv = ['node', 'script.js', '--help']
    
    try {
      // Call the function
      getCommandLineArguments()
      
      // Verify fullInstructions was called
      expect(fullInstructions).toHaveBeenCalled()
      
      // Verify exit was called with 1 (failure exit code)
      expect(exitMock).toHaveBeenCalledWith(1)
    } finally {
      // Restore original argv and cleanup mocks
      process.argv = originalArgv
      exitMock.mockRestore()
      vi.resetModules()
    }
  })

  it('should process arguments when receiving 4 arguments', () => {
    // Save original process.argv and process.exit
    const originalArgv = process.argv
    const exitMock = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
    
    // Mock process.argv with 4 arguments (node, script, action, data)
    process.argv = ['node', 'script.js', '--hash', '--data=testData']
    
    // Mock processArguments indirectly by expecting the result
    try {
      const result = getCommandLineArguments()
      
      // Verify exit was not called
      expect(exitMock).not.toHaveBeenCalled()
      
      // Verify correct result was returned
      expect(result).toEqual({
        action: 'hash',
        hasMinimumArguments: true,
        data: 'testData',
        key: '',
        salt: '',
        legacySeed: ''
      })
    } finally {
      // Restore original argv and cleanup mocks
      process.argv = originalArgv
      exitMock.mockRestore()
    }
  })

  it('should show full instructions and exit when there are 5 arguments', () => {
    // Save original process.argv and process.exit
    const originalArgv = process.argv
    const exitMock = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
    
    // Mock process.argv with 5 arguments (node, script, action, data, key)
    process.argv = ['node', 'script.js', '--encrypt', '--data=testData', '--key=testKey']
    
    try {
      // Call the function
      getCommandLineArguments()
      
      // Verify fullInstructions was called
      expect(fullInstructions).toHaveBeenCalled()
      
      // Verify exit was called with 1 (failure exit code)
      expect(exitMock).toHaveBeenCalledWith(1)
    } finally {
      // Restore original argv and cleanup mocks
      process.argv = originalArgv
      exitMock.mockRestore()
    }
  })

  it('should process arguments when receiving 6 arguments', () => {
    // Save original process.argv and process.exit
    const originalArgv = process.argv
    const exitMock = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    // Mock process.argv with 6 arguments (node, script, action, data, key, salt)
    process.argv = ['node', 'script.js', '--decrypt', '--data=encryptedData', '--key=testKey', '--salt=testSalt']
    
    try {
      const result = getCommandLineArguments()
      
      // Verify exit was not called
      expect(exitMock).not.toHaveBeenCalled()
      
      // Verify correct result was returned
      expect(result).toEqual({
        action: 'decrypt',
        hasMinimumArguments: true,
        data: 'encryptedData',
        key: 'testKey',
        salt: 'testSalt',
        legacySeed: ''
      })
    } finally {
      // Restore original argv and cleanup mocks
      process.argv = originalArgv
      exitMock.mockRestore()
      consoleSpy.mockRestore()
    }
  })

  it('Should show full instructions and exit when there are more than 6 arguments', () => {
    // Save original process.argv and process.exit
    const originalArgv = process.argv
    const exitMock = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const instructionsSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    // Mock process.argv with 7 arguments (node, script, action, data, key, salt, legacySeed) 
    process.argv = ['node', 'script.js', '--hash', '--data=testData', '--key=testKey', '--salt=testSalt', '--legacySeed=legacyValue']
    try {
      // Call the function
      getCommandLineArguments()
      
      // Verify fullInstructions was called
      expect(instructionsSpy).toHaveBeenCalled()
      
      // Verify exit was called with 1 (failure exit code)
      expect(exitMock).toHaveBeenCalledWith(1)
    } finally {
      // Restore original argv and cleanup mocks
      process.argv = originalArgv
      exitMock.mockRestore()
      consoleSpy.mockRestore()
      instructionsSpy.mockRestore()
      vi.resetModules()
    }
  })

  it('should throw an error when minimum arguments are not provided', () => {
    // Save original process.argv and process.exit
    const originalArgv = process.argv
    const exitMock = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const instructionsSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    // Mock process.argv with hash action but no data
    process.argv = ['node', 'script.js', '--hash', '--key=testKey']
    
    try {
      // Should throw error because hasMinimumArguments is false (no data for hash)
      expect(() => getCommandLineArguments()).toThrow('No data provided. Use (for example) `--data="Hello, World!"` to specify the data.')
      
      // Verify fullInstructions was called
      expect(fullInstructions).toHaveBeenCalled()
      
      // Verify exit was not called (because an error is thrown instead)
      expect(exitMock).not.toHaveBeenCalled()
    } finally {
      // Restore original argv and cleanup mocks
      process.argv = originalArgv
      exitMock.mockRestore()
      consoleSpy.mockRestore()
      instructionsSpy.mockRestore()
      vi.resetModules()
    }
  })

  it('should handle when an invalid action is provided', () => {
    // Save original process.argv and process.exit
    const originalArgv = process.argv
    const exitMock = vi.spyOn(process, 'exit').mockImplementation((code) => {
      // Throw a special error that we can catch to simulate process.exit stopping execution
      throw new Error(`EXIT_CODE_${code}`);
    })
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    // Mock process.argv with valid length but invalid action
    process.argv = ['node', 'script.js', '--invalidAction', '--data=test']
    
    try {
      // Call the function - should throw our special error
      expect(() => getCommandLineArguments()).toThrow('EXIT_CODE_1')
      
      // Verify fullInstructions was called
      expect(fullInstructions).toHaveBeenCalled()
      
      // Verify exit was called with 1 (failure exit code)
      expect(exitMock).toHaveBeenCalledWith(1)
    } finally {
      // Restore original argv and cleanup mocks
      process.argv = originalArgv
      exitMock.mockRestore()
      consoleSpy.mockRestore()
      vi.resetModules()
    }
  })

})