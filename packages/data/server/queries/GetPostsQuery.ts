import { gql } from '@apollo/client/core';
import postFragment from '../fragments/postFragment';

export default gql`
query(
  $filter: PostFilterInput
  $currentPage: Int
  $pageSize: Int = 0
  $search: String
  $sort: PostSortInput
) {
  posts(
    filter: $filter
    currentPage: $currentPage
    pageSize: $pageSize
    search: $search
    sort: $sort
  ) {
    totalCount 
    posts {
      ${postFragment}
    }
  }
}
`;