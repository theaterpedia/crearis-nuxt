import { gql } from '@apollo/client/core';
import eventFragment from '../fragments/eventFragment';

export default gql`
    mutation UpdateEvent($event: UpdateEventInput!) {
        updateEvent(event: $event) {
            ${eventFragment}
        }
    }
`;