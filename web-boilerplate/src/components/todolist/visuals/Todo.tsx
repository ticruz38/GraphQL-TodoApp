import * as React from "react";
import * as Moment from "moment";
import { compose } from "recompose";
import { graphql, MutationFn } from "react-apollo";
import { Checkbox, Button } from "antd";
import gql from "graphql-tag";
import { RemoveTodo, ToggleTodo, GetTodos } from "graphql-typings";
import { FormattedMessage } from "react-intl";

type InputProps = {
  removeTodo: (todoId: string) => any;
  todo: GetTodos.Todos;
};

type Props = {
  removeTodo: Function;
  toggleTodo: MutationFn<ToggleTodo.Mutation, ToggleTodo.Variables>;
  todo: GetTodos.Todos;
};

export class Todo extends React.PureComponent<Props> {
  toggle = () => {
    this.props.toggleTodo({
      variables: { id: this.props.todo.id },
      optimisticResponse: {
        toggleTodo: {
          ...this.props.todo,
          done: !this.props.todo.done
        }
      }
    });
  };

  render() {
    return (
      <div className="todo">
        <div className="flex spaced">
          <Checkbox onChange={this.toggle} checked={this.props.todo.done} />
          <h3>{this.props.todo.title}</h3>
        </div>
        <div className="date" style={{ position: "absolute", top: "1rem", right: "1rem" }}>
          {Moment.unix(this.props.todo.date / 1000).format("ll")}
        </div>
        <div className="content">{this.props.todo.content}</div>
        <div className="button-wrapper flex">
          <Button type="danger" onClick={_ => this.props.removeTodo(this.props.todo.id)}>
            <FormattedMessage id="todolist.delete" />
          </Button>
        </div>
      </div>
    );
  }
}

export const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: String) {
    toggleTodo(id: $id) {
      id
      done
    }
  }
`;

export default compose<Props, InputProps>(graphql(TOGGLE_TODO, { name: "toggleTodo" }))(Todo);
