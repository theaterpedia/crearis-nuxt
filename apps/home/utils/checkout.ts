export interface FormContactInformationProps {
  vorname?: string
  nachname?: string
  email?: string
  plz?: string
  ort?: string
  strasse?: string
  mobil?: string
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
}
