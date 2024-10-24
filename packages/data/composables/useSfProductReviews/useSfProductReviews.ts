import { toRefs } from '@vueuse/shared';
import type {
  UseSfProductReviews,
  UseProductReviewsState,
  FetchProductReviews,
} from './types';

/**
 * @description Composable managing product reviews data
 * @param {string} slug Product slug
 * @returns {@link UseProductReturn}
 * @example
 * const { data, loading, fetchProductReviews } = useSfProductReviews('product-slug');
 */
export const useSfProductReviews: UseSfProductReviews = (slug) => {
  const state = useState<UseProductReviewsState>(`useSfProductReviews-${slug}`, () => ({
    data: null,
    loading: false,
  }));

  /** Function for fetching product reviews data
   * @param {string} slug Product slug
   * @example
   * fetchProductReviews('product-slug');
   */
  // #TODO _05 reactivate with odoo
  const fetchProductReviews: FetchProductReviews = async (slug) => {

    /*
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().commerce.getProductReviews({ slug }));
    useHandleError(error.value);
    state.value.data = data.value;
    state.value.loading = false;
    return data; */
    return {};
  };

  return {
    fetchProductReviews,
    ...toRefs(state.value),
  };
};
