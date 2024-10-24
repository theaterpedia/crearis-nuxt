import { describe, expect, it } from 'vitest'

function sum(...nums) {
  return nums.reduce((acc, num) => acc + num, 0)
}

describe('1 + 1', () => {
  it('1 + 1', () => {
    expect(sum(1 + 1)).toEqual(2)
  })
})

it('1 + 2 + 3 + 4', () => {
  expect(sum(1 + 2 + 3 + 4)).toEqual(10)
})

it('1 number', () => {
  expect(sum(100)).toEqual(100)
})
