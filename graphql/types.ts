import type { AsyncData } from 'nuxt/app'
import type { H3Error } from 'h3'
import type {
  AttributeValue,
  Cart,
  Category,
  Country,
  Partner,
  Post,
  Product,
  ProductVariant,
  ShippingMethod,
  WishlistData,
} from './gql/graphql'

export type CategoryListResponse = AsyncData<
  {
    categories: {
      categories: Category[]
      totalCount: number
    }
  },
  H3Error
>

export type CategoryResponse = AsyncData<
  {
    category: Category
  },
  H3Error
>

export type ProductTemplateListResponse = AsyncData<
  {
    products: {
      attributeValues: AttributeValue[]
      maxPrice?: number
      minPrice?: number
      totalCount: number
      products: Product[]
    }
  },
  H3Error
>

export type ProductResponse = AsyncData<
  {
    product: Product
  },
  H3Error
>

export type ProductVariantResponse = AsyncData<
  {
    productVariant: ProductVariant
  },
  H3Error
>

export type WishlistLoadResponse = AsyncData<
  {
    wishlistItems: WishlistData
  },
  H3Error
>

export type WishlistAddItemResponse = AsyncData<
  {
    wishlistAddItem: WishlistData
  },
  H3Error
>

export type WishlistRemoveItemResponse = AsyncData<
  {
    wishlistRemoveItem: WishlistData
  },
  H3Error
>

export type CartResponse = AsyncData<
  {
    cart: Cart
  },
  H3Error
>

export type CartAddItemResponse = AsyncData<
  {
    cartAddItem: Cart
  },
  H3Error
>
export type CartUpdateItemResponse = AsyncData<
  {
    cartUpdateItem: Cart
  },
  H3Error
>

export type CartRemoveItemResponse = AsyncData<
  {
    cartRemoveItem: Cart
  },
  H3Error
>

export type LoadUserQueryResponse = AsyncData<
  {
    partner: Partner
  },
  H3Error
>

export type RegisterUserResponse = AsyncData<
  {
    id: number
    name: string
    email: string
    partner: Partner
  },
  H3Error
>

export type LoginUserResponse = AsyncData<
  {
    partner: Partner
  },
  H3Error
>

export type ResetPasswordResponse = AsyncData<
  {
    id: number
    name: string
    email: string
  },
  H3Error
>

export type PartnerResponse = AsyncData<Partner, H3Error>

export type AddressesResponse = AsyncData<
  {
    addresses: Partner[]
  },
  H3Error
>
export type AddAddressResponse = AsyncData<
  {
    addAddress: Partner
  },
  H3Error
>

export type UpdatePostResponse = AsyncData<
  {
    updatePost: Post
  },
  H3Error
>

export type AddPostResponse = AsyncData<
  {
    addPost: Post
  },
  H3Error
>

export type UpdatePasswordResponse = AsyncData<
  {
    updatePassword: {
      id: number
    }
  },
  H3Error
>

export type UpdateMyAccountResponse = AsyncData<
  {
    updateMyAccount: Partner
  },
  H3Error
>

export type CreateUpdatePartnerResponse = AsyncData<
  {
    createUpdatePartner: Partner
  },
  H3Error
>

export type UpdateAddressResponse = AsyncData<
  {
    updateAddress: Partner
  },
  H3Error
>

export type CountryListResponse = AsyncData<
  {
    countries: {
      countries: Country[]
      totalCount: number
    }
  },
  H3Error
>

export type DeliveryMethodListResponse = AsyncData<
  {
    deliveryMethods: ShippingMethod[]
  },
  H3Error
>

export type PaymentMethodListResponse = AsyncData<
  {
    paymentAcquirers: PaymentAcquirer[]
  },
  H3Error
>
