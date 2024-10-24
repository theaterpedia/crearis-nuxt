import { gql } from '@apollo/client/core';
import postFragment from '../fragments/postFragment';

export default gql`
    mutation UpdatePost($post: UpdatePostInput!) {
        updatePost(post: $post) {
            ${postFragment}
        }
    }
`;