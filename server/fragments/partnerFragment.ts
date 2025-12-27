export default `
partner{
    id
    name
    public
    addressType    
    firstName
    lastName
    isCompany
    street
    street2
    city
    zip
    country
    {
      id
      name
    }
    email
    phone   
    websiteLink
    company {
      id
    }
    contacts {
      id
    }
    signupValid
    md
    imagePath    
    billingAddress {
      id
    }
  }
`
