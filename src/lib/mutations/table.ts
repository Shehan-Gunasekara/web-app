import { gql } from "@apollo/client";

export const GENERATE_TABLE_QR_CODE = gql`
  mutation ($input: CreateTableQrDto!) {
    generateTableQrCode(input: $input)
  }
`;

export const REGENERATE_TABLE_QR_CODE = gql`
  mutation ($input: ReGenerateTableQrDto!) {
    regenerateTableQrCode(input: $input) {
      id
      qr_code
    }
  }
`;
export const REGENERATE_ALL_QR_CODES = gql`
  mutation ($restId: Float!) {
    generateAllQrCodes(restId: $restId)
  }
`;
// export const REGENERATE_TABLE_QR_CODE = gql`
//   mutation ($tableId: String!) {
//     regenerateTableQrCode(tableId: $tableId) {
//       id
//       qr_code
//     }
//   }
// `;
// export const GENERATE_TABLE_QR_CODE = gql`
//   mutation ($id: String!) {
//     generateTableQrCode(id: $id) {
//       id
//       qr_code
//     }
//   }
// `;

export const GENERATE_QR_CODE = gql`
  mutation ($data: String!) {
    generateQrCode(data: $data)
  }
`;

export const CREATE_TABLE = gql`
  mutation ($input: CreateTableDto!) {
    createTable(tableInput: $input) {
      id
      restaurant_id
      table_number
      status
      seating_capacity
    }
  }
`;

export const UPDATE_TABLE = gql`
  mutation ($input: UpdateTableDto!) {
    updateTable(tableInput: $input) {
      id
      restaurant_id
      table_number
      status
      seating_capacity
    }
  }
`;
export const DELETE_TABLES = gql`
  mutation ($tableInput: DeleteTableStatusDto!) {
    deleteTables(tableInput: $tableInput)
  }
`;

export const MOVE_TABLES_OFFLINE = gql`
  mutation ($tableInput: MoveTableStatusDto!) {
    moveTablesOffline(tableInput: $tableInput)
  }
`;
