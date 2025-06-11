import { VERSION_TEXT } from './config/defaultTexts.js'

export function version(): void {
  console.log(`
    easy-crypto-utils Version: ${VERSION_TEXT}
  `)
}

export function fullInstructions(): void {
  hashConsoleInstructions()
  encryptConsoleInstructions()
  decryptConsoleInstructions()
}


export function hashConsoleInstructions(): void {  console.log(`
    Hashing Instructions:
    
    To hash a string, use the following command:
    
    ecu --hash --data="your-string-to-hash"
    
    Example:
    
    ecu --hash --data="Hello, World!"
    
    This will output the MD5 hash of the provided string.
  `)
}


export function encryptConsoleInstructions(): void {  console.log(`
    Encryption Instructions:
    
    To encrypt a string, use the following command:
    
    ecu --encrypt --data="your-string-to-encrypt" --key="your-encryption-key" --salt="salt-value"
    
    Example:
    
    ecu --encrypt --data="Hello, World!" --key="my-secret-key" --salt="salty!"
    
    This will output an encrypted string prefixed with ${VERSION_TEXT} using AES-256 encryption.
  `)
}


export function decryptConsoleInstructions(): void {  console.log(`
    Decryption Instructions:
    
    ---
    
    To decrypt an encrypted string that starts with ${VERSION_TEXT}, use the following command:
    
    ecu --decrypt --data="your-encrypted-string" --key="your-encryption-key" --salt="salt-value"
    
    Example:
    
    ecu --decrypt --data="ECU-v2<encrypted-data>" --key="my-secret-key" --salt="salty!"
    
    ---
    
    To decrypt a legacy format encrypted string, use the following command:
    
    ecu --decrypt --data="your-encrypted-string" --key="your-encryption-key" --seed="legacy-seed"
    
    Example:
    
    ecu --decrypt --data="<legacy-encrypted-data>" --key="my-secret-key" --seed="legacy-seed-value"
    
    ---
    
    This will output the decrypted string using AES-256 decryption.
  `)
}

export function projectInfo(): void {
  console.log(`
    Issues may be reported at https://github.com/Swinomish-Indian-Tribal-Community/easy-crypto-utils/issues
  `)
}