import type { SfShippingMethods, Maybe } from '@vue-storefront/unified-data-model';

export interface UseSfCartShippingMethodsState {
  data: Maybe<SfShippingMethods>;
  loading: boolean;
}

export type GetSfShippingMethods = () => Promise<Ref<Maybe<SfShippingMethods>>>;

export interface UseSfCartShippingMethods {
  data: Readonly<Ref<UseSfCartShippingMethodsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  getSfShippingMethods: GetSfShippingMethods;
}

export type UseSfCartShippingMethodsReturn = () => UseSfCartShippingMethods;
