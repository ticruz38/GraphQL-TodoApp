import "./TodoList.scss";
import * as React from "react";
import { uniqBy } from "lodash";
import * as PropTypes from "prop-types";
import gql from "graphql-tag";
import { graphql, MutationFn, DataProps } from "react-apollo";
import { compose, getContext } from "recompose";
import { RemoveTodo, GetTodos, AddTodo } from "graphql-typings";
import { loader } from "src/shared-components";
import Todo from "./visuals/Todo";
import { Form, Input, Icon, Button } from "antd";
import { FormProps } from "antd/lib/form";
import { InjectedIntl } from "react-intl";

const FormItem = Form.Item;

type Props = DataProps<GetTodos.Query> &
  FormProps & {
    intl: InjectedIntl;
    removeTodo: MutationFn<RemoveTodo.Mutation, RemoveTodo.Variables>;
    addTodo: MutationFn<AddTodo.Mutation, AddTodo.Variables>;
  };

export class TodoList extends React.PureComponent<Props> {
  createTodo = e => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.addTodo({
          variables: { todo: this.props.form.getFieldsValue() },
          update: (cache, { data }) => {
            cache.writeQuery({
              query: GET_TODOS,
              data: { todos: uniqBy([...this.props.data.todos, data.addTodo], "id") }
            });
          }
        });
      }
    });
  };

  deleteTodo = (todoId: string) => {
    this.props.removeTodo({
      variables: { id: todoId },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: this.props.data.todos.filter(t => t.id !== todoId) }
        });
      }
    });
  };

  message(key) {
    return this.props.intl.formatMessage({ id: key });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="todo-list container">
        <Form>
          <FormItem>
            {getFieldDecorator("title", {
              rules: [{ required: true, message: this.message("todolist.errors.required") }]
            })(
              <Input
                prefix={<Icon type="bars" style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder={this.message("todolist.titlePlaceholder")}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("content", {
              rules: [{ required: true, message: this.message("todolist.errors.required") }]
            })(
              <Input
                prefix={<Icon type="paper-clip" style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder={this.message("todolist.contentPlaceholder")}
              />
            )}
          </FormItem>
          <Button type="primary" htmlType="submit" onClick={this.createTodo}>
            {this.message("todolist.createTodo")}
          </Button>
        </Form>
        <br />
        {[...this.props.data.todos]
          .sort((a, b) => a.date - b.date)
          .map(todo => <Todo key={todo.id} todo={todo} removeTodo={this.deleteTodo} />)}
      </div>
    );
  }
}

export const TODO_FRAGMENT = gql`
  fragment TodoFragment on Todo {
    id
    title
    content
    done
    date
  }
`;

export const ADD_TODO = gql`
  ${TODO_FRAGMENT}
  mutation AddTodo($todo: TodoInput) {
    addTodo(todo: $todo) {
      ...TodoFragment
    }
  }
`;

export const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String) {
    removeTodo(id: $id) {
      id
    }
  }
`;

export const GET_TODOS = gql`
  ${TODO_FRAGMENT}
  query GetTodos {
    todos {
      ...TodoFragment
    }
  }
`;

export default compose(
  getContext({
    intl: PropTypes.object.isRequired
  }),
  graphql(ADD_TODO, { name: "addTodo" }),
  graphql(REMOVE_TODO, { name: "removeTodo" }),
  graphql(GET_TODOS, { options: { fetchPolicy: "cache-and-network" } }),
  Form.create(),
  loader()
)(TodoList);
