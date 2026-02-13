export interface FormContactInformationProps {
  vorname?: string
  nachname?: string
  email?: string
  plz?: string
  ort?: string
  strasse?: string
  mobil?: string
}

export interface FormChecksAndSummaryProps {
  agb?: boolean
  datenschutz?: boolean
  ruecktritt?: boolean
  anmerkungen?: string
  alabel?: string
  dlabel?: string
  rlabel?: string
  mailheading?: string
  kosten?: string
}

export interface CheckoutRecord {
  basistag: string
  ratentyp: string
  kursumfang: string
  strasse: string
  kurs: string
  verification: boolean
  plz: string
  ort: string
  vorname: string
  geburtsdatum: string
  geschlecht: string
  anmerkungen: string
  tel: string
  mobil: string
  name: string
  email: string
  storno: string
  bemerkungen: string
  individualprogramm: string
  details: string
  start: string
  ende: string
  actionstep: string
  mailbody: string
  ratenzahl: string
  json: string
}

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
  /** Product SKU for Odoo checkout (e.g. "MOD-A", "MOD-B") */
  sku?: string
}

// --- GraphQL Checkout Types (Odoo integration) ---

/**
 * Contact info for GraphQL CheckoutInput
 * Maps to CheckoutContactInput in Odoo schema
 */
export interface CheckoutContactInput {
  email: string
  vorname: string
  nachname: string
  strasse?: string
  plz?: string
  ort?: string
  mobil?: string
}

/**
 * Input for GraphQL Checkout mutation
 */
export interface CheckoutInput {
  productRef: string
  contact: CheckoutContactInput
  path?: 'muenchen_block' | 'muenchen_day' | 'nuernberg_block' | 'nuernberg_day'
  notes?: string
  acceptTerms: boolean
  acceptPrivacy: boolean
  acceptCancellation: boolean
}

/**
 * Result from GraphQL Checkout mutation
 */
export interface CheckoutResult {
  success: boolean
  error?: string
  order?: { id: number; name: string }
  partner?: { id: number; email: string }
  registrations?: number
  packageLines?: number
}

/**
 * State for useCheckout composable
 */
export interface CheckoutState {
  step: number
  contact: CheckoutContactInput
  path?: CheckoutInput['path']
  acceptances: {
    terms: boolean
    privacy: boolean
    cancellation: boolean
  }
  notes: string
  isSubmitting: boolean
  result?: CheckoutResult
}
