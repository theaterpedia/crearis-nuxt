import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { expect, test } from 'vitest'
import { parse } from '../../utils/parse'

const currentDir = dirname(fileURLToPath(import.meta.url))

test('parse obsidian markdowns', () => {
  for (const file of fs.readdirSync(join(currentDir, 'fixtures'))) {
    if (file.endsWith('.input.md')) {
      const input = fs.readFileSync(join(currentDir, 'fixtures', file), 'utf-8')
      const output = fs.readFileSync(join(currentDir, 'fixtures', file.replace('.input.md', '.output.md')), 'utf-8')
      expect(parse(input)).toBe(output)
    }
  }
})
