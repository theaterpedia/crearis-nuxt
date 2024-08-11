import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { parse } from '../../utils/parse'
import { expect } from 'vitest'

const currentDir = dirname(fileURLToPath(import.meta.url))


export function testCollectionKey(variant: string, key: string) {
  for (const file of fs.readdirSync(join(currentDir, 'fixtures', variant))) {
    if (file.endsWith('.input.md') && file.startsWith(key)) {
      const input = fs.readFileSync(join(currentDir, 'fixtures', variant, file), 'utf-8')
      const output = fs.readFileSync(join(currentDir, 'fixtures', variant, file.replace('.input.md', '.output.md')), 'utf-8')
      expect(parse(input)).toBe(output)
    }
  }
}

export function testCollectionFilter(variant: string, filter: string) {
  for (const file of fs.readdirSync(join(currentDir, 'fixtures', variant))) {
    if (file.endsWith('.input.md') && file.includes(filter)) {
      const input = fs.readFileSync(join(currentDir, 'fixtures', variant, file), 'utf-8')
      const output = fs.readFileSync(join(currentDir, 'fixtures', variant, file.replace('.input.md', '.output.md')), 'utf-8')
      expect(parse(input)).toBe(output)
    }
  }
}

export function testCollection(variant: string) {
  for (const file of fs.readdirSync(join(currentDir, 'fixtures', variant))) {
    if (file.endsWith('.input.md')) {
      const input = fs.readFileSync(join(currentDir, 'fixtures', variant, file), 'utf-8')
      const output = fs.readFileSync(join(currentDir, 'fixtures', variant, file.replace('.input.md', '.output.md')), 'utf-8')
      expect(parse(input)).toBe(output)
    }
  }
}

