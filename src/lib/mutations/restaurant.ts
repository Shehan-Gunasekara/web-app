import { gql } from "@apollo/client";

export const CREATE_RESTAURANT = gql`
  mutation ($input: CreateRestaurantDto!) {
    createRestaurant(restaurantInput: $input) {
      id
      name
      image
      contact_information
    }
  }
`;

export const UPDATE_RESTAURANT = gql`
  mutation ($input: UpdateRestaurantDto!) {
    updateRestaurant(restaurantInput: $input) {
      id
      name
      image
      contact_information
      business_hours {
        day
        start_time
        end_time
      }
      country
      tax_value
      state
      time_zone
      currency
      ordering_active
      tax_inclueded
      tax_is_set_manually
    }
  }
`;

export const GET_RESTAURANT_BY_USER_EMAIL = gql`
  mutation ($user_email: String!) {
    getRestaurantByUserEmail(user_email: $user_email) {
      id
      name
      image
      location
      contact_information
      business_hours {
        day
        start_time
        end_time
      }
      country
      tax_value
      state
      time_zone
      currency
      ordering_active
      tax_inclueded
      tax_is_set_manually
      color
    }
  }
`;
