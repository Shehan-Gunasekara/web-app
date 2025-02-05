import { gql } from "@apollo/client";

export const GET_ALL_MENUS = gql`
  query ($restaurant_id: Float!) {
    getAllMenus(restaurant_id: $restaurant_id) {
      menus {
        id
        name
        is_active
        item_count
        color
        language
        icon
        description
        restaurant_id
        categories {
          id
          name
          is_deleted
          is_items_deleted
        }
        is_special
        is_deleted
        is_items_deleted
      }
      menuCount
      specialMenuCount
      categoryCount
      specialCategoryCount
      itemCount
      specialItemCount
      archiveCategoryCount
      archivedItemCount
      archivedMenuCount
    }
  }
`;

// export const GET_ALL_MENUS = gql`
// query {
//   getAllMenus {
//     id
//     name
//     is_active
//     item_count
//     color
//     color
//     icon
//     description
//     restaurant_id
//     categories {
//       id
//       name
//     }
//   }
// }
// `;

export const GET_MENU_BY_ID = gql`
  query ($id: Float!) {
    getMenu(id: $id) {
      id
      name
      is_active
      item_count
      color
      language
      icon
      description
      restaurant_id
      categories {
        id
        name
      }
      items {
        id
        name
      }
    }
  }
`;

///////////////// CATEGORY ///////////////////////

export const GET_ALL_CATEGORIES = gql`
  query ($restaurant_id: Float!) {
    getAllCategorys(restaurant_id: $restaurant_id) {
      id
      restaurant_id
      menu_id
      name
      is_active
      item_count
      color
      icon
      description
      menu {
        id
        name
      }
      items {
        id
        name
        is_deleted
      }
      is_special
      is_deleted
      is_items_deleted
    }
  }
`;

export const GET_CATEGORY_BY_ID = gql`
  query ($id: Float!) {
    getCategory(id: $id) {
      id
      name
      is_active
      item_count
      color
      icon
      description
      restaurant_id
    }
  }
`;

export const IS_MENU_DELETABLE = gql`
  query isMenuDeletable($id: Float!) {
    isMenuDeletable(id: $id)
  }
`;

export const IS_CATEGORY_DELETABLE = gql`
  query ($id: Float!) {
    isCategoryDeletable(id: $id)
  }
`;
