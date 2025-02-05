import { gql } from "@apollo/client";

export const UPLOAD_IMAGE = gql`
  mutation ($input: FileUploadDto!) {
    getFileUploadUrl(input: $input)
  }
`;

export const DELETE_FILE = gql`
  mutation ($input: FileDeleteDto!) {
    removeFileFromBucket(input: $input)
  }
`;
