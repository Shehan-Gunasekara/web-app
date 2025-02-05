import { gql } from "@apollo/client";

export const GET_ALL_RESTAURANTS = gql`
  query {
    getAllRestaurants {
      id
      name
      image
      location
      operation_hours
      contact_information
      contact_email
    }
  }
`;

export const GET_RESTAURANT = gql`
  query ($id: Float!) {
    getRestaurant(id: $id) {
      id
      name
      image
      location
      contact_information
      contact_email
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
