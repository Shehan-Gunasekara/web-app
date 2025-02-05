import { gql } from "@apollo/client";

export const DELETE_HANDWAVES = gql`
  mutation ($ids: [Float!]!) {
    clientDeleteNotifications(ids: $ids)
  }
`;

export const UPDATE_HANDWAVES = gql`
  mutation ($inputs: [UpdateNotificationDto!]!) {
    clientUpdateNotifications(inputs: $inputs) {
      id
      message
    }
  }
`;

export const ATTEND_REQUEST = gql`
  mutation AttendHandwaveReq($tableNumber: Float!, $resturantID: Float!) {
    attendHandwaveReq(tableNumber: $tableNumber, resturantID: $resturantID) {
      id
      restaurant_id
      table_number
      customer_name
      status
      message
      created_at
      sender_id
      receiver_id
      sender_type
      receiver_type
      session_started
      session_ended
      updated_at
    }
  }
`;

export const ATTEND_ALL_REQUEST = gql`
  mutation AttendAllHandwaveReq($resturantID: Float!) {
    attendAllHandwaveReq(resturantID: $resturantID) {
      id
      restaurant_id
      table_number
      customer_name
      status
      message
      created_at
      sender_id
      receiver_id
      sender_type
      receiver_type
      session_started
      session_ended
      updated_at
    }
  }
`;

export const UPDATE_HANDWAVE = gql`
  mutation ($input: UpdateNotificationDto!) {
    clientUpdateNotification(input: $input) {
      id
      message
    }
  }
`;
