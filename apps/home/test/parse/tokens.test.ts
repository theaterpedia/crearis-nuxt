import { testCollectionFilter, testCollectionKey } from './helpers'
import { test } from 'vitest'

/** DESCRIPTION
 * Here we test things that are executed before the main function is called.:
 * - `==text==` > `<mark>text</mark>`
 * - wiki links
 * - embeds and tabs
 */
test('-> parse [tokens] mark', () => {
  testCollectionKey('tokens', 'mark')
})
