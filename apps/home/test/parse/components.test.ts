import { testCollectionFilter, testCollectionKey } from './helpers'
import { test } from 'vitest'

/*
TAKES IN:
> [!agenda|color=primary-dark variant=summary] **Text**
> Blah
>> [!blank] Column 1
>> - Use another callout for columns
>
>> [!blank] Column 2
>> Need that singular blockquote `>` as separation between columns

RETURNS:
::agenda
----
title: **Text**
color: primary-dark
variant: summary
----
Blah
  ::blank
  ----
  title: Column 1
  ----
  - Use another callout for columns
  ::

  ::blank
  ----
  title: Column 1
  ----
  - Use another callout for columns
  ::
::
*/

test('-> parse [basic] component', () => {
  console.log('testing the logger')
  testCollectionFilter('basic', 'component')
})
