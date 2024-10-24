import { useSfCart } from '../useSfCart';

describe('useSfCart', () => {
  it('should return account data', async () => {
    const { fetchCart, data } = useSfCart();

    await fetchCart();

    expect(data.value).not.toBeUndefined();
  });
});
