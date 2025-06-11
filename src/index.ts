#!/usr/bin/env node

import { hash } from './hash.js'
import { encrypt } from './encrypt.js'
import { decrypt } from './decrypt.js'

import { getCommandLineArguments } from './utils/getCommandLineArguments.js'
import { fullInstructions, projectInfo } from './utils/instructions.js'

import type { ICommandLineArgumentInfo } from './utils/getCommandLineArguments.js'

// Process executed from the command line

const cmdArgs = getCommandLineArguments()

if (cmdArgs.hasMinimumArguments) {
  switch (cmdArgs.action) {
    case 'hash': processHash(cmdArgs)
    break
    case 'encrypt': processEncrypt(cmdArgs)
    break
    case 'decrypt': processDecrypt(cmdArgs)
    break
    default:
      console.log('There was an issue with the `getCommandLineArguments` function.')
      console.log('Please open an issue with details of your environment.')
      projectInfo()
      process.exit(1)
  }  
} else {
  console.log(fullInstructions())
}

// Support functions to call the main functions

function processHash (cmdArgs: ICommandLineArgumentInfo) {
  console.log(hash(cmdArgs.data))
}

function processEncrypt (cmdArgs: ICommandLineArgumentInfo) {
  if (!cmdArgs.data || !cmdArgs.key || !cmdArgs.salt) {
    throw new Error(`Data, key, and salt must be provided for encryption.
      example: encrypt --data="Hello, World!" --key="your-encryption-key" --salt="your-salt-value"`)
  }
  console.log(encrypt(cmdArgs.data, cmdArgs.key, cmdArgs.salt))
}

function processDecrypt (cmdArgs: ICommandLineArgumentInfo) {
  if (!cmdArgs.data || !cmdArgs.key || (!cmdArgs.legacySeed && !cmdArgs.salt)) {
    throw new Error(`Data and key must be provided for decryption.
      example: decrypt --data="ECU-v2<encrypted-data>" --key="your-encryption-key"`)
  }
  console.log(
    decrypt(cmdArgs.data, cmdArgs.key, {
      legacySeed: cmdArgs.legacySeed,
      salt: cmdArgs.salt || '',
    })
  )
}
