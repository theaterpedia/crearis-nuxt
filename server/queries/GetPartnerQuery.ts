import { gql } from '@apollo/client/core'
import partnerFragment from '../fragments/partnerFragment'

export default gql`
query(
  $filter: PartnerFilterInput
) {
  partners(
    filter: $filter
  ) {
    ${partnerFragment}
  }
}
`;
