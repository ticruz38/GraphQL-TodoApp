import * as React from "react";
import * as PropTypes from "prop-types";
import { Menu, Icon, Dropdown, Badge, Avatar } from "antd";
import { graphql, DataProps, MutationFunc } from "react-apollo";
import { compose, getContext } from "recompose";
import { CurrentUser, Signout } from "graphql-typings";
import gql from "graphql-tag";
import { loader } from "src/shared-components";
import { RouterProps } from "react-router";
import ApolloClient from "apollo-client";
import { CURRENT_USER } from "src/shared-queries";
import { AppState } from "src/store/reducers/app";
import { connect } from "react-redux";
import { switchLang } from "src/store/actions";

const { Item } = Menu;

export class LoggedMenu extends React.PureComponent<Props> {
  get menu() {
    return (
      <Menu>
        <Item
          onClick={_ =>
            this.props.logout().then(_ => {
              window["sessionStorage"].removeItem("apollo-cache-persist");
              this.props.client.cache.reset();
              this.props.router.history.push("/login");
            })
          }
        >
          <Icon type="logout" style={{ marginRight: "10px" }} />Logout
        </Item>
        <Item onClick={_ => this.props.switchLang(this.props.lang == "en" ? "fr" : "en")}>
          {this.props.lang == "en" ? "Francais" : "English"}
        </Item>
      </Menu>
    );
  }

  render() {
    if (!this.props.data.user) return null;
    return (
      <div>
        <Dropdown overlay={this.menu}>
          <div className="logged-menu">
            <Badge dot>
              <Avatar shape="square" children={this.props.data.user.username[0]} />
            </Badge>
            {this.props.data.user.username}
            <Icon type="down" />
          </div>
        </Dropdown>
      </div>
    );
  }
}

type Props = DataProps<CurrentUser.Query> &
  StateFromProps &
  DispatchFromProps & {
    logout: MutationFunc<Signout.Mutation>;
    router: RouterProps;
    client: ApolloClient<any>;
  };

interface StateFromProps {
  lang: string;
}
const mapStateToProps = (store: { app: AppState }) => ({
  lang: store.app.lang
});

interface DispatchFromProps {
  switchLang: (lang: string) => void;
}
const mapDispatchToProps = dispatch => ({
  switchLang: (lang: string) => dispatch(switchLang(lang))
});

const LOGOUT = gql`
  mutation Signout {
    logout
  }
`;

export default compose(
  getContext({
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(CURRENT_USER),
  graphql(LOGOUT, { name: "logout" }),
  loader()
)(LoggedMenu);
