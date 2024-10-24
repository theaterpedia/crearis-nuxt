import { gql } from '@apollo/client/core';
import eventFragment from '../fragments/eventFragment';

export default gql`
query(
  $filter: EventFilterInput
  $currentPage: Int
  $pageSize: Int = 0
  $search: String
  $sort: EventSortInput
) {
  events(
    filter: $filter
    currentPage: $currentPage
    pageSize: $pageSize
    search: $search
    sort: $sort
  ) {
    totalCount
    minDate
    maxDate    
    events {
      ${eventFragment}
    }
  }
}
`;