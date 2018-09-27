import { Icon, Menu, Affix } from "antd";
import ApolloClient from "apollo-client";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { compose, getContext, withProps } from "recompose";
import LoggedMenu from "./visuals/LoggedMenu";
import { Locked } from "src/shared-components";
import { boilerplate } from "static/images";

const { Item } = Menu;
class CondensedHeader extends React.PureComponent<Props> {
  get current() {
    const routes = ["todolist", "admin"];
    return routes.filter(r => this.props.location.pathname.includes(r));
  }

  render() {
    return (
      <Affix>
        <div className="condensed-header">
          <div className="flex s-b container">
            <Menu
              selectedKeys={this.current}
              onClick={e => this.props.history.push("/" + e.key)}
              mode="horizontal"
            >
              {this.props.full ? (
                <Item key="dashboard">
                  <img className="app-icon" src={boilerplate} />
                </Item>
              ) : null}
              <Item key="todolist">
                <Locked>
                  <Icon type="swap" />
                  <FormattedMessage id="header.tabs.todos" />
                </Locked>
              </Item>
              <Item key="admin">
                <Locked roles={["admin"]}>
                  <Icon type="profile" />
                  <FormattedMessage id="header.tabs.admin" />
                </Locked>
              </Item>
            </Menu>
            {this.props.full ? <LoggedMenu /> : null}
          </div>
        </div>
      </Affix>
    );
  }
}

type Props = {
  location: Location;
  history: any;
  client: ApolloClient<any>;
  full: boolean;
};

export default compose<Props, { full: boolean }>(
  getContext({
    router: PropTypes.object.isRequired,
    client: PropTypes.object
  }),
  withProps(({ router, ...otherProps }) => ({
    location: router.history.location,
    history: router.history,
    ...otherProps
  }))
)(CondensedHeader);
