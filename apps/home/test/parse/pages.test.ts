import { testCollectionFilter, testCollectionKey } from './helpers'
import { test } from 'vitest'

/** DESCRIPTION


*/
test('-> parse [pages] ausbildung', () => {
  testCollectionFilter('pages', 'ausbildung')
})
