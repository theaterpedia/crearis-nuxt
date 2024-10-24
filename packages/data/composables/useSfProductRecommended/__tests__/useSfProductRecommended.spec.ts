import { useSfProductRecommended } from '../useSfProductRecommended';

describe('useSfProductRecommended', () => {
  it('should return product reviews', async () => {
    const slug = 'athletic-mens-walking-sneakers';
    const { data: recommendedProducts, fetchProductRecommended } = useSfProductRecommended(slug);

    await fetchProductRecommended(slug);

    expect(recommendedProducts.value).not.toBeUndefined();
  });
});
