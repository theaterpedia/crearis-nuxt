// Simplified heading-logic > could be extended to fullstyle headings
// Odoo uses 'heading' field, which gets mapped to Pruvious 'title' field in SyncableOdooCollection
export default `
    cid
    slug
    templateCode
    writeDate	      
    version
    editMode
    visibility      
    heading
    teasertext
    md
    cimg
    headerType
    headerSize
    formatOptions
    blocks      
    dateBegin
    dateEnd      
    stage { id, name, description }
    eventType { id, name, seatsMax }
    publicUser { id, name, partner { id, name, email, phone } }
    company { id, name }
    website { domainCode, url }
    organizer {id, name, email, phone}
    location {id, name, street, street2, city, zip, state {id, name}, country {id, name}}
    ticketInstructions
`
