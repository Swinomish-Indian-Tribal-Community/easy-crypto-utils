import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    typecheck: {
      tsconfig: './tsconfig.test.json'
    }
  }
})
