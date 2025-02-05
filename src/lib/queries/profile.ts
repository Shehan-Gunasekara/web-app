import { gql } from "@apollo/client";

export const GET_ALL_TAX_COLLECTIONS = gql`
  query {
    getAllTaxCollections {
      id
      country
      state
      tax
    }
  }
`;
