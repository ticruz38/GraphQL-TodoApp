import "./Login.scss";

import * as React from "react";
import * as PropTypes from "prop-types";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { InjectedIntl } from "react-intl";
import { RouteComponentProps } from "react-router";
import { FormProps } from "antd/lib/form";
import { compose, getContext } from "recompose";
import gql from "graphql-tag";
import { Login, Signup, RandomLogin } from "graphql-typings";
import { graphql, MutationFn } from "react-apollo";

const FormItem = Form.Item;

type Props = FormProps &
  RouteComponentProps<any> & {
    intl: InjectedIntl;
    login: MutationFn<Login.Mutation, Login.Variables>;
    signup: MutationFn<Signup.Mutation, Signup.Variables>;
    randomLogin: MutationFn<RandomLogin.Mutation, RandomLogin.Variables>;
  };

class NormalLoginForm extends React.Component<Props> {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login({
          variables: values,
          update: (cache, { data }) => {
            cache.writeData({ data: { user: data.login } });
            this.props.history.push("/todolist");
          }
        });
      }
    });
  };

  handleSignup = e => {
    this.props.form.validateFields((err, values) => {
      const { remember, ...userInput } = values;
      if (!err) {
        this.props.signup({
          variables: { user: userInput },
          update: (cache, { data, errors }) => {
            cache.writeData({ data: { user: data.signup } });
            this.props.history.push("/todolist");
          }
        });
      }
    });
    // this.props.form.getFieldsValue();
  };

  randomLogin = e => {
    e.preventDefault();
    this.props.randomLogin({
      update: (cache, { data }) => {
        cache.writeData({ data: { user: data.randomLogin } });
        this.props.history.push("/todolist");
      }
    });
  };

  message(key) {
    return this.props.intl.formatMessage({ id: key });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form container small">
        <FormItem>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: this.message("login.usernameError") }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder={this.message("login.username")}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: this.message("login.passwordError") }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder={this.message("login.password")}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("remember", {
            valuePropName: "checked",
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="" onClick={this.randomLogin}>
            {this.message("login.forgotpassword")}
          </a>
          <div className="flex s-b spaced">
            <Button type="primary" htmlType="submit" className="fluid">
              {this.message("login.login")}
            </Button>
            <Button className="fluid" onClick={this.handleSignup}>
              {this.message("login.signup")}
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    username
    roles
  }
`;

const LOGIN = gql`
  ${USER_FRAGMENT}
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      ...UserFragment
    }
  }
`;

const RANDOM_LOGIN = gql`
  ${USER_FRAGMENT}
  mutation RandomLogin {
    randomLogin {
      ...UserFragment
    }
  }
`;

const SIGNUP = gql`
  ${USER_FRAGMENT}
  mutation Signup($user: UserInput) {
    signup(user: $user) {
      ...UserFragment
    }
  }
`;

export default compose(
  getContext({
    intl: PropTypes.object.isRequired
  }),
  graphql(LOGIN, { name: "login" }),
  graphql(SIGNUP, { name: "signup" }),
  graphql(RANDOM_LOGIN, { name: "randomLogin" }),
  Form.create()
)(NormalLoginForm);
