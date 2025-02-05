import { gql } from "@apollo/client";

export const GET_ALL_ITEMS = gql`
  query ($restaurant_id: Float!) {
    getAllItems(restaurant_id: $restaurant_id) {
      id
      restaurant_id
      menu_id
      category_id
      name
      description
      img_url
      img_urls
      price
      is_active
      labels
      custom_labels
      is_special
      is_deleted
      item_options {
        id
        item_id
        type
        title
        choice_limit
        index_no
        choices {
          label
          price
          index_no
        }
      }
    }
  }
`;

export const GET_ITEM_BY_ID = gql`
  query ($id: Float!) {
    getItem(id: $id) {
      id
      restaurant_id
      menu_id
      category_id
      name
      description
      img_url
      img_urls
      price
      is_active
      labels
      custom_labels
      item_options {
        id
        item_id
        type
        title
        choice_limit
        index_no
        choices {
          label
          price
          index_no
        }
      }
    }
  }
`;

export const GET_ALL_ITEM_OPTIONS = gql`
  query ($restaurant_id: Float!) {
    getAllItemOptions(restaurant_id: $restaurant_id) {
      id
      item_id
      type
      title
      choice_limit
      index_no
      choices {
        label
        price
        index_no
      }
    }
  }
`;

export const GET_EXISTING_ITEM_OPTIONS = gql`
  query ($restaurant_id: Float!) {
    getItemOptionByRestaurantId(restaurant_id: $restaurant_id) {
      id
      item_id
      type
      title
      choice_limit
      index_no
      choices {
        label
        price
        index_no
      }
    }
  }
`;

export const IS_ITEM_DELETABLE = gql`
  query ($id: Float!) {
    isItemDeletable(id: $id)
  }
`;
