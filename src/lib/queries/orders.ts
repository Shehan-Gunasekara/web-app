import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query GetAllOrders($restaurant_id: Float!) {
    getOrders(restaurant_id: $restaurant_id) {
      id
      customer_id
      restaurant_id
      order_no
      status
      table_id
      customer {
        id
        name
      }
      table {
        id
        table_number
      }
      items {
        id
        name
        price
      }
      orderDetails {
        item_id
        quantity
      }
      amount
      is_bumped
    }
  }
`;

export const NEW_ORDER_SUBSCRIPTION = gql`
  subscription NewOrder($restaurant_id: Int!) {
    newOrder(restaurant_id: $restaurant_id) {
      id
      restaurant_id
      table_id
      order_no
      date
      status
      tax
      customer_id
      customer_name
      amount
      is_active
    }
  }
`;

export const GET_ORDERS_BY_RESTAURENT_ID = gql`
  query getOrdersByRestaurantId($input: FindByRestaurantIdDto!) {
    getOrdersByRestaurantId(input: $input) {
      id
      customer_id
      restaurant_id
      order_no
      status
      table_id
      customer {
        id
        name
      }
      table {
        id
        table_number
      }
      orderDetails {
        id
        item_id
        quantity
        order_item_options {
          id
          item_id
          item_option_id
          choice_index
        }
      }
      items {
        id
        name
        price
        item_options {
          id
          type
          choices {
            label
            price
          }
        }
      }
      amount
      is_bumped
      cancelled_reason
      bounce_reset
      is_active
      date
    }
  }
`;
export const GET_ORDERS_BY_TABLE_ID = gql`
  query ($id: Float!) {
    getOrdersByTable(id: $id) {
      orders {
        id
        restaurant_id
        customer_id
        is_active
        tax
        customer_id
        customer {
          name
        }
        table {
          session_start_time
          table_number
          status
        }
        date
        amount
        order_no
        items {
          id
          name
        }
        orderDetails {
          item_id
          total
          quantity
          order_item_options {
            id
            item_id
            item_option_id
            choice_index
          }
        }
        status
      }
      total
      item_count
    }
  }
`;

export const GET_TABLE_ORDER_COUNT = gql`
  query GetTableOrderCount($table_id: Float!, $resturant_id: Float!) {
    getTableOrderCount(table_id: $table_id, resturant_id: $resturant_id)
  }
`;
export const GET_ORDERS_DESCRIPTION_OF_TABLE = gql`
  query ($table_id: Float!, $resturant_id: Float!) {
    getOrderDetailsOfTable(table_id: $table_id, resturant_id: $resturant_id) {
      orders {
        id
        restaurant_id
        customer_id
        is_active
        customer {
          name
        }
        table {
          session_start_time
          table_number
          status
        }
        date
        amount
        order_no
        items {
          id
          name
        }
        orderDetails {
          item_id
          total
          quantity
        }
        status
      }
      diners
      active_orders
      total_orders
    }
  }
`;

export const GET_ORDERS_BY_TABLE_AND_CUSTOMER = gql`
  query ($input: FindByTableCustomerDto!) {
    getOrdersByTableAndCustomer(input: $input) {
      orders {
        id
        restaurant_id
        customer_id
        date
        amount
        tax
        order_no
        is_active
        customer {
          name
        }
        status
        items {
          id
          name
        }
        orderDetails {
          item_id
          quantity
          total
        }
      }
      total
      item_count
    }
  }
`;
export const GET_ACTIVE_ORDERS = gql`
  query ($restaurant_id: Float!) {
    getActiveOrders(restaurant_id: $restaurant_id) {
      id
      restaurant_id
      table_id
      customer_id
      order_no
      customer_id
      date
      amount
      status
      is_bumped
      is_active
      tax
      table {
        id
        table_number
        status
        session_start_time
      }
      customer {
        name
        id
      }
      items {
        id
        name
        price
        item_options {
          id
          type
          title
          choices {
            label
            price
          }
        }
      }
      orderDetails {
        id
        item_id
        quantity
        total
        order_item_options {
          id
          item_id
          item_option_id
          choice_index
        }
      }
    }
  }
`;

export const GET_INACTIVE_ORDERS = gql`
  query ($restaurant_id: Float!, $page: Int!, $size: Int!, $status: String!) {
    getInactiveOrders(
      restaurant_id: $restaurant_id
      page: $page
      size: $size
      status: $status
    ) {
      orders {
        id
        restaurant_id
        table_id
        customer_id
        order_no
        customer_id
        date
        amount
        status
        is_bumped
        cancelled_reason
        bounce_reset
        is_active
        tax
        table {
          id
          table_number
          status
          session_start_time
        }
        customer {
          id
          name
        }
        items {
          id
          name
          price
          item_options {
            id
            type
            title
            choices {
              label
              price
            }
          }
        }
        orderDetails {
          id
          item_id
          quantity
          total
          order_item_options {
            id
            item_id
            item_option_id
            choice_index
          }
        }
      }
      hasMore
    }
  }
`;

export const GET_LIMITED_ORDERS = gql`
  query ($restaurant_id: Float!, $page: Int!, $size: Int!) {
    getLimitedOrders(restaurant_id: $restaurant_id, page: $page, size: $size) {
      orders {
        id
        restaurant_id
        table_id
        customer_id
        order_no
        customer_id
        date
        amount
        status
        is_bumped
        cancelled_reason
        bounce_reset
        is_active
        tax
        table {
          id
          table_number
          status
          session_start_time
        }
        customer {
          id
          name
        }
        items {
          id
          name
          price
          item_options {
            id
            type
            title
            choices {
              label
              price
            }
          }
        }
        orderDetails {
          id
          item_id
          quantity
          total
          order_item_options {
            id
            item_id
            item_option_id
            choice_index
          }
        }
      }
      hasMore
    }
  }
`;
