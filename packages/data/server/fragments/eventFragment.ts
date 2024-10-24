export default `
    syncId
    id
    slug
    writeDate	      
    version
    editMode
    visibility
    templateCode          
    headline      
    overline
    teasertext
    blocks      
    dateBegin
    dateEnd      
    stage { id, name, description }
    eventType { id, name, seatsMax }
    publicUser { id, name }
    company { id, name }
    website { domainCode }
    organizer {id, name, email, phone}
    location {id, name, street, street2, city, zip, state {id, name}, country {id, name}}
    ticketInstructions
`;