# Easy Crypto Utils (easy-crypto-utils)

A lightweight TypeScript library providing simple cryptographic utilities for Node.js applications, featuring both programmatic and command-line interfaces.

## Features

- **AES-256 Encryption**: Secure encryption with key-derived initialization vector
- **Flexible Decryption**: Supports both current and legacy formats
- **MD5 Hashing**: Fast hash generation for strings
- **Command-line Interface**: Simple CLI tool with the `ecu` command
- **TypeScript Support**: Full type definitions included
- **Zero Dependencies**: Uses only Node.js built-in crypto module

## Installation

```bash
npm install easy-crypto-utils
```

## Usage from Code

### Code Example: Encryption

```javascript
import { encrypt } from 'easy-crypto-utils';

const encrypted = encrypt('Hello, World!', 'your-encryption-key', 'your-salt-value');
console.log(encrypted); // ECU-v2<encrypted-data>
```

### Code Example: Decryption

```javascript
import { decrypt } from 'easy-crypto-utils';

// For current version (ECU-v2 prefix)
const decrypted = decrypt(encrypted, 'your-encryption-key', { salt: 'your-salt-value' });
console.log(decrypted); // 'Hello, World!'

// For legacy format
const decryptedLegacy = decrypt(legacyEncrypted, 'your-encryption-key', { legacySeed: 'legacy-seed' });
```

### Code Example: Hashing

```javascript
import { hash } from 'easy-crypto-utils';

// Generate MD5 hash
const hashedString = hash('Hello, World!');
console.log(hashedString);
```

## Command Line Usage

The package installs a CLI tool named `ecu`. Here are the available commands:

### CLI Example: Encryption

```bash
ecu --encrypt --data="Hello, World!" --key="your-encryption-key" --salt="your-salt-value"
```

### CLI Example: Decryption

For current version (ECU-v2 prefix):

```bash
ecu --decrypt --data="ECU-v2<encrypted-data>" --key="your-encryption-key" --salt="your-salt-value"
```

For legacy format:

```bash
ecu --decrypt --data="<legacy-encrypted-data>" --key="your-encryption-key" --seed="legacy-seed-value"
```

### CLI Example: Hashing

```bash
ecu --hash --data="Hello, World!"
```

### CLI Example: Version Info

```bash
ecu --version
```

### CLI Example: Help

```bash
ecu --help
```

## API Reference

### `encrypt(data: string, key: string, salt: string): string`

Encrypts the provided data using AES-256 encryption.

- Parameters:
  - `data`: The string to encrypt
  - `key`: The encryption key
  - `salt`: Salt value used to derive the initialization vector
- Returns: Encrypted string prefixed with 'ECU-v2'

### `decrypt(data: string, key: string, seedOrSalt: { salt?: string, legacySeed?: string }): string`

Decrypts the provided data.

- Parameters:
  - `data`: The encrypted string
  - `key`: The encryption key
  - `seedOrSalt.salt`: Salt value for current version format
  - `seedOrSalt.legacySeed`: Seed value for legacy format
- Returns: Decrypted string

**NOTE:** Either the `salt` or the `legacySeed` must be provided.
If `salt` is omitted when used with the current format,
or if `legacySeed` is omitted when used with the legacy format,
an error will be thrown.

### `hash(data: string): string`

Generates an MD5 hash of the provided data.

- Parameters:
  - `data`: The string to hash
- Returns: MD5 hash as a hexadecimal string

## Security Notes

- This library uses AES-256 encryption with key-derived initialization vectors
- Salt values should be unique and securely stored
- The MD5 hash function is provided for general use but is not cryptographically secure - do not use for password hashing

## Development

### Prerequisites

- Node.js (v20.19.0 or higher)
- npm or yarn

### Setup

```bash
git clone https://github.com/Swinomish-Indian-Tribal-Community/easy-crypto-utils.git
cd easy-crypto-utils
npm install
```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## License

MIT © Swinomish Indian Tribal Community

## Issues

Report issues at [GitHub Issues](https://github.com/Swinomish-Indian-Tribal-Community/easy-crypto-utils/issues)
