// Simplified heading-logic > could be extended to fullstyle headings
// Odoo uses 'heading' field, which gets mapped to Pruvious 'title' field in SyncableOdooCollection
export default `
  cid
  id
  slugPost
  slugBlog
  writeDate
  version
  public
  publishDate
  visits
  heading
  teasertext     
  blocks
  md
  cimg
  headerType
  headerSize
  formatOptions
  author { id, name, email }
  blog { id, name, templateCode }
  homesite { domain, domainCode }
  seoName      
  metaTitle
  metaKeywords
  metaDescription
`
