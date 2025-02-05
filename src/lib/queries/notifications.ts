import { gql } from "@apollo/client";

export const GET_HANDWAVES_BY_RESTAURANT_ID = gql`
  query getAllNotificationsByRestaurantId($id: Float!) {
    getAllNotificationsByRestaurantId(id: $id) {
      newRequest {
        table_number
        data {
          id
          restaurant_id
          table_number
          customer_name
          status
          message
          created_at
        }
      }
      attendedRequest {
        table_number
        data {
          id
          restaurant_id
          table_number
          customer_name
          status
          message
          created_at
        }
      }
      allRequest {
        table_number
        data {
          id
          restaurant_id
          table_number
          customer_name
          status
          message
          created_at
        }
      }
    }
  }
`;
