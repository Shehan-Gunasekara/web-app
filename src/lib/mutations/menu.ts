import { gql } from "@apollo/client";

export const CREATE_MENU = gql`
  mutation CreateMenu($menuInput: CreateMenuDto!) {
    createMenu(menuInput: $menuInput) {
      id
      name
      is_active
      item_count
      color
      language
      icon
      description
      restaurant_id
    }
  }
`;

export const UPDATE_MENU = gql`
  mutation ($menuInput: UpdateMenuDto!) {
    updateMenu(menuInput: $menuInput) {
      id
      name
      is_active
      item_count
      color
      language
      icon
      description
      restaurant_id
    }
  }
`;

export const DELETE_MENU = gql`
  mutation ($id: Float!) {
    deleteMenu(id: $id)
  }
`;

export const ARCHIVE_MENU = gql`
  mutation ArchiveMenu($id: Float!) {
    archiveMenu(id: $id)
  }
`;

export const UPDATE_MENU_ORDER = gql`
  mutation ($menuInput: UpdateMenuFloatingPointDto!) {
    updateMenuFloatingPoint(menuInput: $menuInput) {
      name
      floating_point
    }
  }
`;

///////////////////////////// Category /////////////////////////////

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($categoryInput: CreateCategoryDto!) {
    createCategory(categoryInput: $categoryInput) {
      id
      name
      is_active
      item_count
      menu_id
      color
      icon
      description
      restaurant_id
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation ($categoryInput: UpdateCategoryDto!) {
    updateCategory(categoryInput: $categoryInput) {
      id
      name
      is_active
      item_count
      menu_id
      color
      icon
      description
      restaurant_id
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation ($id: Float!) {
    deleteCategory(id: $id)
  }
`;

export const ARCHIVE_CATEGORY = gql`
  mutation ArchiveCategory($id: Float!) {
    archiveCategory(id: $id)
  }
`;

export const UPDATE_CATEGORY_ORDER = gql`
  mutation ($menuInput: UpdateCategoryFloatingPointDto!) {
    updateCategoryFloatingPoint(menuInput: $menuInput) {
      name
      floating_point
    }
  }
`;

///////////////////////////// Item /////////////////////////////

export const CREATE_ITEM = gql`
  mutation ($input: CreateItemDto!) {
    createItem(itemInput: $input) {
      id
      name
      description
      img_url
      price
      is_active
      labels
      menu {
        id
      }
      restaurant_id
      category {
        id
      }
      item_options {
        type
        title
        choice_limit
        choices {
          label
          price
        }
      }
    }
  }
`;
