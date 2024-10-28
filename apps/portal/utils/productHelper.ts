// #DEBUG: _05 ambiguous indirect export: Product
// import { Product } from '@crearis/data-main/graphql';
// export const mountUrlSlugForProductVariant = (product: Product) : string => {

export function mountUrlSlugForProductVariant(product): string {
  const params = product?.variantAttributeValues
    ?.map((variantAttributeValue) => `${variantAttributeValue?.attribute?.name}=${variantAttributeValue?.id}&`)
    ?.join('')

  const joinedSlug = `${product.slug}?${params}`
  return joinedSlug.slice(0, -1)
}
