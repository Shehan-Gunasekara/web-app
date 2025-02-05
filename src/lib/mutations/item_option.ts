import { gql } from "@apollo/client";

export const UPDATE_ITEM_OPTION = gql`
  mutation ($input: UpdateItemOptionDto!) {
    updateItemOption(itemOptionInput: $input) {
      id
      item_id
      type
      title
      choice_limit
      index_no
      restaurant_id
      choices {
        label
        price
        index_no
      }
    }
  }
`;
