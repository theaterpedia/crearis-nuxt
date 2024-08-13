import { test, expect } from 'vitest'
import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { findCallout } from '../../utils/parse'

/** DESCRIPTION

*/
test('-> find-callout defined/undefined', () => {
  testCallouts_defined('find-callout')
})

test('-> find-callout results', () => {
  testCallouts_result('find-callout')
})

const currentDir = dirname(fileURLToPath(import.meta.url))

export function testCallouts_defined(variant: string) {
  for (const file of fs.readdirSync(join(currentDir, 'fixtures', variant))) {
    if (file.endsWith('.input.md')) {
      const input = fs.readFileSync(join(currentDir, 'fixtures', variant, file), 'utf-8')
      const body = fs.readFileSync(join(currentDir, 'fixtures', variant, file.replace('.input.md', '.body.md')), 'utf-8')
      const lines = input.split('\n')
      if (file.startsWith('no.callout')) {
        expect(findCallout(lines, 0)).toBeUndefined()
      }
      if (file.startsWith('yes')) {
        expect(findCallout(lines, 0)).toBeDefined()
      }
    }
  }
}

export function testCallouts_result(variant: string) {
  for (const file of fs.readdirSync(join(currentDir, 'fixtures', variant))) {
    if (file.endsWith('.input.md')) {
      const input = fs.readFileSync(join(currentDir, 'fixtures', variant, file), 'utf-8')
      const body = fs.readFileSync(join(currentDir, 'fixtures', variant, file.replace('.input.md', '.body.md')), 'utf-8')
      const lines = input.split('\n')
      if (file.includes('5lines')) {
        expect(findCallout(lines, 0)?.lines).toBe(5)
        expect(findCallout(lines, 0)?.body).toBe(body)
      }
    }
  }
}