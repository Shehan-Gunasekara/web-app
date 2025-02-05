import { gql } from "@apollo/client";

export const CREATE_ITEM = gql`
  mutation ($input: CreateItemDto!) {
    createItem(itemInput: $input) {
      id
      name
      price
      description
      img_url
      img_urls
      labels
      category {
        id
      }
    }
  }
`;

// {
//     "input": {
//       "name": "otalana Pizza",
//       "description": "sample",
//       "img_url": "https://upload.wikimedia.org/wikipedia/commons/9/91/Pizza-3007395.jpg",
//       "price": 100.00,
//       "is_active": true,
//       "labels": ["vegetarian"],
//       "menu_id": "e65f69d7-3170-46ab-9e19-59ffd70a572e",
//       "category_id":"90c57d7b-b3f9-457e-b31d-fc0568ada189",
//       "restaurant_id": 1,
//       "item_options":{
//         "type": "OPTIONS",
//         "title": "PizzaPro",
//         "choice_limit": 1,
//         "choices": {
//           "label": "Spicia",
//           "price": 20.00
//         }
//       }
//     }
//   }

export const UPDATE_ITEM = gql`
  mutation ($itemInput: UpdateItemDto!) {
    updateItem(itemInput: $itemInput) {
      id
      name
      description
      img_url
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation ($id: Float!) {
    deleteItem(id: $id)
  }
`;

export const ARCHIVE_ITEM = gql`
  mutation ArchiveItem($id: Float!) {
    archiveItem(id: $id)
  }
`;

export const UPDATE_ITEM_ORDER = gql`
  mutation ($itemInput: UpdateItemFloatingPointDto!) {
    updateItemFloatingPoint(itemInput: $itemInput) {
      name
      floating_point
    }
  }
`;
