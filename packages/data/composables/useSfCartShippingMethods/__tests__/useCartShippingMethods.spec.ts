import { useSfCartShippingMethods } from '../useSfCartShippingMethods';

describe('useSfCartShippingMethods', () => {
  it('should return shipping methods', async () => {
    const { getSfShippingMethods, data } = useSfCartShippingMethods();

    await getSfShippingMethods();

    expect(data.value).not.toBeUndefined();
  });
});
