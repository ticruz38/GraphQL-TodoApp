import { DataProps, graphql } from "react-apollo";
import * as React from "react";
import * as classnames from "classnames";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { CURRENT_USER } from "src/shared-queries";
import { Loader } from "src/shared-components";
import { CurrentUser } from "graphql-typings";

import "./PrivateRoute.scss";
import gql from "graphql-tag";

type Props = DataProps<CurrentUser.Query> & InputProps;

const PrivateRouteComponent = ({ data, roles, component: Component, ...rest }: Props) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (data.loading) return <Loader />;
        if (data.user && data.user.id) {
          if (roles && !roles.some(role => data.user.roles.some(r => r == role))) {
            return <Redirect to="/login" />; // transactions is the single route allowed for any user
          }
          return <Component {...props} />;
        }
        return <Redirect to={{ pathname: "/login", state: { from: rest.location } }} />;
      }}
    />
  );
};

const LayoutLoader = ({ className }: { className: string }) => {
  return (
    <div>
      <div className={classnames("layout-loader", className)} />
    </div>
  );
};

type InputProps = RouteProps & {
  roles?: string[];
  path: string;
};

export default graphql<InputProps, DataProps<CurrentUser.Query>, {}>(CURRENT_USER)(
  PrivateRouteComponent
);
