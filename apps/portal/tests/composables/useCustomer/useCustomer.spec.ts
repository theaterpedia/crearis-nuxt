import { useCustomer } from '#imports'

describe('useCustomer', () => {
  it('should return account data', async () => {
    const { fetchCustomer, data } = useCustomer()

    await fetchCustomer()

    // changed the test

    expect(data.value).not.toBeUndefined()
  })
})
