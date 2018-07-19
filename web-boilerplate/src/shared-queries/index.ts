import gql from "graphql-tag";

export const CURRENT_USER = gql`
  query CurrentUser {
    user {
      id
      username
      roles
    }
  }
`;
