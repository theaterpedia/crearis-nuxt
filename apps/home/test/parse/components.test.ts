import { testCollectionFilter, testCollectionKey } from './helpers'
import { test } from 'vitest'

/** DESCRIPTION
 * Here we test these features:
 * - wrongly named / not existing components
 * - nesting until level 4
 * - handling of simple props and flags
 * - handling of prose inside the component
 */

test('-> parse [basic] component', () => {
  console.log('testing the logger')
  testCollectionFilter('basic', 'component')
})
