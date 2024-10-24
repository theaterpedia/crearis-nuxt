import { useSfProducts } from '../useSfProducts';

describe('useSfProducts', () => {
  it('should return products', async () => {
    const { fetchProducts, data } = useSfProducts();

    await fetchProducts();

    expect(data.value).not.toBeUndefined();
  });
});
