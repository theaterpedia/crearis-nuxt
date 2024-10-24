import { gql } from '@apollo/client/core';
import postFragment from '../fragments/postFragment';

export default gql`
    mutation AddPost($post: AddBlogPostInput!) {
        addPost(post: $post) {
            ${postFragment}
        }
    }
`;