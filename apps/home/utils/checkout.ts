export interface CheckoutInfo {
  title: string
  header?: string
  description?: string
  footer?: string
  fields?: Record<string, string>
  info?: Record<string, string>
  agenda?: Record<string, string>
  catalog?: Catalog
  columns?: {
    catalog?: Catalog
    column: string
  }
}

export interface CheckoutStep extends CheckoutInfo {
  name: string
  completed: boolean
}

export interface Catalog {
  title: string
  list?: string
  notes?: string
}

export interface Product {
  id: string
  title: string
  root?: string
  heading?: string
  teaser?: string
  description?: string
  hero?: Object
  image?: string
  start?: Date
  ende?: Date
  ort?: string
  body?: string
  mit?: string
  ablauf?: string
  items?: Product[]
  views?: string[]
  details?: Record<string, CheckoutInfo>
  tag?: string
  cssclasses?: string[]
  ctype?: string
  shortcode?: string
  meta_product?: string
}
