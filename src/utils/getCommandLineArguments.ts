import { fullInstructions, version } from "./instructions.js"

export interface IAction {
  action: 'hash' | 'encrypt' | 'decrypt' | 'help' | 'version'
}
export interface ICommandLineArgumentInfo extends IAction {
  hasMinimumArguments: boolean
  data: string
  key?: string
  salt?: string
  legacySeed?: string
}

/**
 * Parses and validates command line arguments for cryptographic operations.
 * 
 * This function processes the command line arguments provided to the application
 * and determines the appropriate cryptographic action to perform. It handles
 * argument validation, displays help information when needed, and ensures that
 * the minimum required arguments for each operation are present.
 * 
 * The function expects arguments in the following format:
 * - First argument (index 2): The action (--hash, --encrypt, --decrypt, --help, --version)
 * - Subsequent arguments: Parameters like --data, --key, --salt, --seed
 * 
 * If insufficient arguments are provided (2-3 arguments), it displays full instructions.
 * If too many arguments are provided (more than 6), it shows an error message.
 * If the minimum required arguments for the specified action are not present,
 * it throws an error with guidance on how to provide data.
 * 
 * @returns An object containing the parsed command information including the action to perform,
 *          whether minimum arguments are present, and any provided data, key, salt, or legacy seed values.
 * @throws Error when required arguments for the specified action are missing.
 */
export function getCommandLineArguments(): ICommandLineArgumentInfo {
  const rawArguments = process.argv
  let result
  switch(rawArguments.length) {
    case 2:
    case 3:
      console.log('Received too few arguments.')
      fullInstructions()
      process.exit(1)
      break
    case 5:
      console.log('Received either too many or not enough arguments.')
      fullInstructions()
      process.exit(1)
      break
    case 4:
    case 6:
      result = processArguments(rawArguments)
      break
    default:
      console.log('Received more arguments than this project allows.')
      fullInstructions()
      process.exit(1)
  }
  if (result && !result.hasMinimumArguments) {
    fullInstructions()
    throw new Error('No data provided. Use (for example) `--data="Hello, World!"` to specify the data.')
  }
  return result
}

/**
 * Processes command line arguments to determine the action to perform and extract relevant parameters.
 * 
 * This function parses the raw command line arguments to identify the requested cryptographic
 * operation (hash, encrypt, decrypt) or utility action (help, version). It extracts any provided
 * data, key, salt, or legacy seed values from the arguments and validates that the minimum
 * required arguments for the specified action are present.
 *
 * @param rawArguments - An array of strings representing the command line arguments.
 *                       Typically this comes from process.argv, where:
 *                       - rawArguments[0] is the node executable path
 *                       - rawArguments[1] is the script path
 *                       - rawArguments[2] is the action (--hash, --encrypt, etc.)
 *                       - remaining arguments are parameters like --data, --key, etc.
 * 
 * @returns An object containing the parsed command information including:
 *          - action: The cryptographic operation to perform
 *          - hasMinimumArguments: Whether all required arguments for the action are present
 *          - data: The input data to process
 *          - key: The encryption/decryption key (if provided)
 *          - salt: The salt value for encryption/decryption (if provided)
 *          - legacySeed: The legacy seed value for backward compatibility (if provided)
 */
 function processArguments(rawArguments: string[]): ICommandLineArgumentInfo {
  let action: IAction = { action: 'help' }
  const unverifiedAction = rawArguments[2].replace('--', '')

  const key = rawArguments.find((arg) => arg.startsWith('--key='))?.slice('--key='.length) || ''
  const data = rawArguments.find((arg) => arg.startsWith('--data='))?.slice('--data='.length) || ''
  const salt = rawArguments.find((arg) => arg.startsWith('--salt='))?.slice('--salt='.length) || ''
  const legacySeed = rawArguments.find((arg) => arg.startsWith('--seed='))?.slice('--seed='.length) || ''

  let hasMinimumArguments: boolean = false

  switch (unverifiedAction) {
    case 'hash':
      action = {action: 'hash'}
      hasMinimumArguments = data.length > 0
      break
    case 'encrypt':
      action = {action: 'encrypt'}
      hasMinimumArguments = data.length > 0 && key.length > 0 && salt.length > 0
      break
    case 'decrypt':
      action = {action: 'decrypt'}
      hasMinimumArguments = data.length > 0 && key.length > 0 && (legacySeed.length > 0 || salt.length > 0)
      break
    case 'version':
      version()
      process.exit(0)
      // No need to set hasMinimumArguments, as this is just for version info
      break
    case 'help':
      fullInstructions()
      process.exit(0)
      // No need to set hasMinimumArguments, as this is just for instructions
      break
    default:
      fullInstructions()
      process.exit(1)
      // No need to set hasMinimumArguments, as this is just for instructions
      break
  }

  return {
    action: action.action,
    hasMinimumArguments,
    key,
    data,
    salt,
    legacySeed,
  }
}
