import { toRefs } from '@vueuse/shared';
import type {
  UseProductRecommendedReturn,
  UseProductRecommendedState,
  FetchProductRecommended,
} from './types';

/**
 * Composable for getting recommended products data
 * @param {string} slug Product slug
 */
export const useSfProductRecommended: UseProductRecommendedReturn = (slug) => {
  const state = useState<UseProductRecommendedState>(`useSfProductRecommended-${slug}`, () => ({
    data: null,
    loading: false,
  }));

  /** Function for fetching product recommended data
   * @param {string} slug Product slug
   * @example
   * fetchProductRecommended('product-slug');
   */
  // #TODO _05 reactivate with odoo
  const fetchProductRecommended: FetchProductRecommended = async (slug) => {

    /* state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().commerce.getProductRecommended({ slug }));
    useHandleError(error.value);
    state.value.data = data.value;
    state.value.loading = false;
    return data; */

    return {};
  };

  return {
    fetchProductRecommended,
    ...toRefs(state.value),
  };
};
