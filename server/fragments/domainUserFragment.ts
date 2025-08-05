export default `
  syncId
  id
  role
  slug
  description
  version
  user { id, name, email, partner { firstname, lastname, street, street2, zip, city, mobile, image, bodyMd } }
  `
