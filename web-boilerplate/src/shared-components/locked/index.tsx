import { DataProps, graphql } from "react-apollo";
import gql from "graphql-tag";
import * as React from "react";
import { RoleQuery } from "graphql-typings";

type Props = {
  roles?: string[];
  visible?: boolean;
};

class LockedElement extends React.PureComponent<Props & DataProps<RoleQuery.Query>> {
  static defaultProps = { visible: true, roles: [] };
  get roles() {
    if (this.props.data.loading) return [];
    return (this.props.data.user && this.props.data.user.roles) || [];
  }
  render() {
    if (!this.props.visible) return null;
    if (!this.props.roles.length && this.props.data.user) return this.props.children;
    if (!this.props.roles.some(role => this.roles.some(r => r == role))) return null;
    return this.props.children;
  }
}

const ROLE_QUERY = gql`
  query RoleQuery {
    user {
      id
      roles
    }
  }
`;

export const Locked = graphql<Props, RoleQuery.Query, {}>(ROLE_QUERY)(LockedElement);
