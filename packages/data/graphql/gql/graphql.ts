/* eslint-disable */
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: { input: any; output: any }
}

export type AddAddressInput = {
  city: InputMaybe<Scalars['String']['input']>
  countryId: Scalars['Int']['input']
  email: InputMaybe<Scalars['String']['input']>
  name: Scalars['String']['input']
  phone: Scalars['String']['input']
  stateId: InputMaybe<Scalars['Int']['input']>
  street: Scalars['String']['input']
  street2: InputMaybe<Scalars['String']['input']>
  zip: Scalars['String']['input']
}

export type AddBlogPostInput = {
  authorId: Scalars['Int']['input']
  blocks: InputMaybe<Scalars['GenericScalar']['input']>
  blogId: Scalars['Int']['input']
  headline: Scalars['String']['input']
  metaDescription: InputMaybe<Scalars['String']['input']>
  metaKeywords: InputMaybe<Scalars['String']['input']>
  overline: InputMaybe<Scalars['String']['input']>
  teasertext: InputMaybe<Scalars['String']['input']>
}

export enum AddressEnum {
  Billing = 'Billing',
  Shipping = 'Shipping',
}

export type AddressFilterInput = {
  addressType: InputMaybe<Array<InputMaybe<AddressEnum>>>
}

/** An enumeration. */
export enum AddressType {
  Contact = 'Contact',
  DeliveryAddress = 'DeliveryAddress',
  InvoiceAddress = 'InvoiceAddress',
  OtherAddress = 'OtherAddress',
  PrivateAddress = 'PrivateAddress',
}

export type CartLineInput = {
  id: Scalars['Int']['input']
  quantity: Scalars['Int']['input']
}

export type CategoryFilterInput = {
  id: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  parent: InputMaybe<Scalars['Boolean']['input']>
}

export type CategorySortInput = {
  id: InputMaybe<SortEnum>
}

export type ContactUsParams = {
  company: InputMaybe<Scalars['String']['input']>
  email: Scalars['String']['input']
  message: Scalars['String']['input']
  name: Scalars['String']['input']
  phone: InputMaybe<Scalars['String']['input']>
  subject: Scalars['String']['input']
}

export type CountryFilterInput = {
  id: InputMaybe<Scalars['Int']['input']>
}

export type CountrySortInput = {
  id: InputMaybe<SortEnum>
}

export type DeleteAddressInput = {
  id: Scalars['Int']['input']
}

/** An enumeration. */
export enum EventEditMode {
  Blocks = 'blocks',
  Content = 'content',
  Full = 'full',
  Locked = 'locked',
}

export type EventFilterInput = {
  addressId: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  editMode: InputMaybe<Array<InputMaybe<EventEditMode>>>
  eventType: InputMaybe<Scalars['Int']['input']>
  homesiteOnly: InputMaybe<Scalars['Boolean']['input']>
  ids: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  maxDate: InputMaybe<Scalars['String']['input']>
  minDate: InputMaybe<Scalars['String']['input']>
  name: InputMaybe<Scalars['String']['input']>
  published: InputMaybe<Scalars['Boolean']['input']>
  stages: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
}

export type EventSortInput = {
  date: InputMaybe<SortEnum>
  id: InputMaybe<SortEnum>
  name: InputMaybe<SortEnum>
  stage: InputMaybe<SortEnum>
}

/** An enumeration. */
export enum FilterVisibility {
  Hidden = 'Hidden',
  Visible = 'Visible',
}

export type InvoiceSortInput = {
  id: InputMaybe<SortEnum>
  invoiceDate: InputMaybe<SortEnum>
  name: InputMaybe<SortEnum>
  state: InputMaybe<SortEnum>
}

/** An enumeration. */
export enum InvoiceState {
  Cancelled = 'Cancelled',
  Draft = 'Draft',
  Posted = 'Posted',
}

/** An enumeration. */
export enum InvoiceStatus {
  FullyInvoiced = 'FullyInvoiced',
  NothingtoInvoice = 'NothingtoInvoice',
  ToInvoice = 'ToInvoice',
  UpsellingOpportunity = 'UpsellingOpportunity',
}

export type MailingContactFilterInput = {
  id: InputMaybe<Scalars['Int']['input']>
}

export type MailingContactSortInput = {
  id: InputMaybe<SortEnum>
}

export type MailingInput = {
  mailinglistId: Scalars['Int']['input']
  optout: Scalars['Boolean']['input']
}

export type MailingListFilterInput = {
  id: InputMaybe<Scalars['Int']['input']>
}

export type MailingListSortInput = {
  id: InputMaybe<SortEnum>
}

export type OrderFilterInput = {
  invoiceStatus: InputMaybe<Array<InputMaybe<InvoiceStatus>>>
  stages: InputMaybe<Array<InputMaybe<OrderStage>>>
}

export type OrderSortInput = {
  dateOrder: InputMaybe<SortEnum>
  id: InputMaybe<SortEnum>
  name: InputMaybe<SortEnum>
  state: InputMaybe<SortEnum>
}

/** An enumeration. */
export enum OrderStage {
  Cancelled = 'Cancelled',
  Locked = 'Locked',
  Quotation = 'Quotation',
  QuotationSent = 'QuotationSent',
  SalesOrder = 'SalesOrder',
}

/** An enumeration. */
export enum PaymentTransactionState {
  Authorized = 'Authorized',
  Canceled = 'Canceled',
  Confirmed = 'Confirmed',
  Draft = 'Draft',
  Error = 'Error',
  Pending = 'Pending',
}

export type PostFilterInput = {
  blogs: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  isPublished: InputMaybe<Scalars['Boolean']['input']>
}

export type PostSortInput = {
  id: InputMaybe<SortEnum>
}

export type ProductFilterInput = {
  attribValues: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
  attributeValueId: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  categoryId: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  categorySlug: InputMaybe<Scalars['String']['input']>
  ids: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  maxPrice: InputMaybe<Scalars['Float']['input']>
  minPrice: InputMaybe<Scalars['Float']['input']>
  name: InputMaybe<Scalars['String']['input']>
}

export type ProductInput = {
  id: Scalars['Int']['input']
  quantity: Scalars['Int']['input']
}

export type ProductSortInput = {
  id: InputMaybe<SortEnum>
  name: InputMaybe<SortEnum>
  price: InputMaybe<SortEnum>
}

export type SelectAddressInput = {
  id: Scalars['Int']['input']
}

export enum SortEnum {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type UpdateAddressInput = {
  city: InputMaybe<Scalars['String']['input']>
  countryId: InputMaybe<Scalars['Int']['input']>
  email: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  name: InputMaybe<Scalars['String']['input']>
  phone: InputMaybe<Scalars['String']['input']>
  stateId: InputMaybe<Scalars['Int']['input']>
  street: InputMaybe<Scalars['String']['input']>
  street2: InputMaybe<Scalars['String']['input']>
  zip: InputMaybe<Scalars['String']['input']>
}

export type UpdateEventInput = {
  blocks: InputMaybe<Scalars['GenericScalar']['input']>
  description: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  metaDescription: InputMaybe<Scalars['String']['input']>
  metaKeywords: InputMaybe<Scalars['String']['input']>
  metaTitle: InputMaybe<Scalars['String']['input']>
  name: InputMaybe<Scalars['String']['input']>
  note: InputMaybe<Scalars['String']['input']>
  overline: InputMaybe<Scalars['String']['input']>
  teasertext: InputMaybe<Scalars['String']['input']>
  templateCode: InputMaybe<Scalars['String']['input']>
}

export type UpdateMyAccountParams = {
  email: InputMaybe<Scalars['String']['input']>
  id: InputMaybe<Scalars['Int']['input']>
  name: InputMaybe<Scalars['String']['input']>
}

export type UpdatePostInput = {
  authorId: InputMaybe<Scalars['Int']['input']>
  blocks: InputMaybe<Scalars['GenericScalar']['input']>
  headline: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  metaDescription: InputMaybe<Scalars['String']['input']>
  metaKeywords: InputMaybe<Scalars['String']['input']>
  overline: InputMaybe<Scalars['String']['input']>
  teasertext: InputMaybe<Scalars['String']['input']>
}

/** An enumeration. */
export enum VariantCreateMode {
  Dynamically = 'Dynamically',
  Instantly = 'Instantly',
  NeverOption = 'NeverOption',
}
