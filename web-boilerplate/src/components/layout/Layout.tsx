import * as React from "react";
import { BackTop } from "antd";
import { Route, Switch, Redirect } from "react-router";
import { Login, TodoList, TodoListSubscription, Admin } from "src/components";
import { PrivateRoute, Header } from "src/shared-components";
import { NoSSR } from "src/utils";

const AppLayout = props => (
  <div>
    <Header {...props} />
    <div>{props.children}</div>
  </div>
);

export default () => (
  <NoSSR>
    <div className="app">
      <BackTop />
      <AppLayout>
        <TodoListSubscription />
        <Switch>
          <Route path="/login" component={Login} />
          <PrivateRoute path="/todolist" component={TodoList} />
          <PrivateRoute path="/admin" component={Admin} roles={["admin"]} />
          <Redirect to="/todolist" />
        </Switch>
      </AppLayout>
    </div>
  </NoSSR>
);
