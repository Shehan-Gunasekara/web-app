import { gql } from "@apollo/client";

export const GET_ALL_TABLES = gql`
  query ($restaurant_id: Float!) {
    getTables(restaurant_id: $restaurant_id) {
      id
      restaurant_id
      table_number
      seating_capacity
      status
      qr_code
      session_id
      session_start_time
      session_elapsed_time
      is_available
    }
  }
`;

export const GET_TABLE_BY_ID = gql`
  query ($id: Float!) {
    getTable(id: $id) {
      id
      table_number
      seating_capacity
      qr_code
      status
      location
    }
  }
`;

export const GET_TABLE_HEADER_COUNTS = gql`
  query ($restaurant_id: Float!) {
    getOrdersSummary(restaurant_id: $restaurant_id) {
      free
      occupied
      total
    }
  }
`;

export const IS_TABLE_DELETABLE = gql`
  query ($tableInput: DeleteTableStatusDto!) {
    isTableDeletable(tableInput: $tableInput)
  }
`;
