import { gql } from '@apollo/client/core'
import domainUserFragment from '../fragments/domainUserFragment'

export default gql`
query(
  $currentPage: Int
  $pageSize: Int = 0
) {
  domainusers(
    currentPage: $currentPage
    pageSize: $pageSize
  ) {
    totalCount 
    domainusers {
      ${domainUserFragment}
    }
  }
}
`
