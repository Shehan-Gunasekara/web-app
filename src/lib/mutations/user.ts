import { gql } from "@apollo/client";

export const UPDATE_USER_EMAIL = gql`
  mutation UpdateUserEmail($userInput: UpdateUserDto!) {
    updateUserEmail(userInput: $userInput) {
      id
      email
      name
      restaurant_id
    }
  }
`;
