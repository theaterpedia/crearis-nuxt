import { useSfProductReviews } from '..';

describe('useSfProductReview', () => {
  it('should return product reviews', async () => {
    const slug = 'athletic-mens-walking-sneakers';
    const { data, fetchProductReviews } = useSfProductReviews(slug);

    await fetchProductReviews(slug);

    expect(data.value).toEqual(mockProductReviews);
  });
});
