import "./Header.scss";
import ApolloClient from "apollo-client";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { compose, getContext, withProps } from "recompose";
import LoggedMenu from "./visuals/LoggedMenu";
import CondensedHeader from "./CondensedHeader";
import { RouterProps } from "react-router";
import { boilerplate } from "static/images";

type State = {
  basic?: boolean;
};
class HeaderComponent extends React.Component<HeaderProps, State> {
  state: State = { basic: true };
  componentDidMount() {
    window["onscroll"] = () => {
      window.pageYOffset > 285 || this.isDashboard
        ? this.setState({
            basic: false
          })
        : this.setState({
            basic: true
          });
    };
  }
  componentDidUpdate() {
    if (window.pageYOffset > 285 || this.isDashboard) {
      if (this.state.basic) this.setState({ basic: false });
    } else {
      if (!this.state.basic) this.setState({ basic: true });
    }
  }
  get isDashboard() {
    return this.props.location.pathname.includes("dashboard");
  }

  get isFull() {
    return this.isDashboard || !this.state.basic;
  }

  render() {
    return (
      <div className="fundsdlt-header">
        <div>
          {" "}
          {!this.isDashboard ? (
            <div className="fundsdlt-header-band container flex s-b">
              {" "}
              <div className="main-button" onClick={_ => this.props.router.history.push("/")}>
                {" "}
                <img className="app-icon" src={boilerplate} />
              </div>{" "}
              <LoggedMenu />{" "}
            </div>
          ) : null}
        </div>
        <CondensedHeader full={this.isFull} />{" "}
      </div>
    );
  }
}

type HeaderProps = {
  location: Location;
  client: ApolloClient<any>;
  router: RouterProps;
};
export default compose<HeaderProps, {}>(
  getContext({
    router: PropTypes.object.isRequired,
    client: PropTypes.object
  }),
  withProps(({ router, ...otherProps }) => ({
    location: router.history.location,
    ...otherProps
  }))
)(HeaderComponent);
