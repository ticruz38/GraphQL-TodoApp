import * as React from "react";
import { ApolloClient } from "apollo-client";
import { uniqBy } from "lodash";
import * as PropTypes from "prop-types";
import { compose, getContext } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER } from "src/shared-queries";
import { OnNewTodo, OnRemoveTodo, GetTodos } from "graphql-typings";
import { GET_TODOS } from "./TodoList";
import { Subscription } from "apollo-client/util/Observable";

type Props = {
  client: ApolloClient<any>;
};

class TodoListSubscription extends React.PureComponent<Props> {
  onNewTodo: Subscription;
  onRemoveTodo: Subscription;
  componentDidMount() {
    this.onNewTodo = this.props.client
      .subscribe<{ data: OnNewTodo.Subscription }>({ query: ON_NEW_TODO })
      .subscribe({
        next: ({ data }) => {
          const oldQuery = this.props.client.readQuery<GetTodos.Query>({ query: GET_TODOS });
          this.props.client.writeData({
            data: {
              todos: uniqBy(
                [...oldQuery.todos.filter(t => t.id != data.onNewTodo.id), data.onNewTodo],
                "id"
              )
            }
          });
        }
      });
    this.onRemoveTodo = this.props.client
      .subscribe<{ data: OnRemoveTodo.Subscription }>({ query: ON_REMOVE_TODO })
      .subscribe({
        next: ({ data }) => {
          const oldQuery = this.props.client.readQuery<GetTodos.Query>({ query: GET_TODOS });
          this.props.client.writeData({
            data: { todos: oldQuery.todos.filter(t => t.id != data.onRemoveTodo) }
          });
        }
      });
  }

  componentWillUnmount() {
    this.onNewTodo.unsubscribe();
    this.onRemoveTodo.unsubscribe();
  }

  render() {
    return null;
  }
}

const ON_NEW_TODO = gql`
  subscription OnNewTodo {
    onNewTodo {
      id
      title
      content
      done
      date
    }
  }
`;

const ON_REMOVE_TODO = gql`
  subscription OnRemoveTodo {
    onRemoveTodo
  }
`;

export default compose(
  getContext({
    client: PropTypes.object.isRequired
  }),
  graphql(CURRENT_USER)
)(TodoListSubscription);
