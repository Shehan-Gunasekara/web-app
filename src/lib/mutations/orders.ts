import { gql } from "@apollo/client";

export const UPDATE_ORDER_STATUS = gql`
  mutation ($orderInput: UpdateStatusDto!) {
    updateOrderStatus(orderInput: $orderInput) {
      id
      status
      is_bumped
      cancelled_reason
      bounce_reset
      is_active
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation ($orderInput: UpdateQuantityDto!) {
    updateOrderQuantity(orderInput: $orderInput) {
      id
      restaurant_id
      amount
      items {
        id
      }
      orderDetails {
        item_id
        quantity
      }
    }
  }
`;

export const UPDATE_DINER = gql`
  mutation UpdateDiner($updateDinerInput: UpdateDinerDto!) {
    updateDiner(updateDinerInput: $updateDinerInput) {
      id
      table_id
      customer_id
      date
      status
      item_ids
      amount
    }
  }
`;
