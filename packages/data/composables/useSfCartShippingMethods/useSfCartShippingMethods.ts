import { toRefs } from '@vueuse/shared';
import type {
  UseSfCartShippingMethodsState,
  UseSfCartShippingMethodsReturn,
  GetSfShippingMethods,
} from './types';

/**
 * @description Composable for getting shipping methods.
 * @example
 * const { data, loading, getSfShippingMethods } = UseSfCartShippingMethods();
 */

export const useSfCartShippingMethods: UseSfCartShippingMethodsReturn = () => {
  const state = useState<UseSfCartShippingMethodsState>('useSfCartShippingMethods', () => ({
    data: null,
    loading: false,
  }));

  /**
   * @description Function for fetching shipping methods.
   * @example
   * getSfShippingMethods();
   */

  // #TODO _05 reactivate with odoo
  const getSfShippingMethods: GetSfShippingMethods = async () => {
    // state.value.loading = true;
    // const { data, error } = await useAsyncData(() => useSdk().commerce.getShippingMethods());
    // useHandleError(error.value);
    // state.value.data = data.value;
    // state.value.loading = false;
    return {};
  };

  return {
    getSfShippingMethods,
    ...toRefs(state.value),
  };
};
