import { Context } from "graph";
import pubsub from "schema/PubSub";
import { UserInput, TodoInput } from "graphql-typings";
import { ON_REMOVE_TODO, ON_NEW_TODO } from "../subscriptions";

export default {
  login: function(
    root,
    { username, password }: { username: string; password: string },
    context: Context
  ) {
    const user = context.db.users.find(u => u.username === username);
    if (!user) throw new Error("login.errors.noUser");
    if (password !== user.password) throw new Error("login.errors.wrongPassword");
    context.session.user = user;
    return user;
  },
  randomLogin: (root, args, context: Context) => {
    return context.db.users[Math.round(Math.random() * 1000) % context.db.users.length];
  },
  logout: function(root, args, context: Context) {
    context.session.user = null;
  },
  signup: function(root, { user }: { user: UserInput }, context: Context) {
    if (context.db.users.find(u => u.username == user.username)) {
      throw new Error("login.errors.userExist");
    }
    return context.db.addUser(user);
  },
  addTodo: function(root, { todo }: { todo: TodoInput }, context: Context) {
    const newTodo = context.db.addTodo(todo);
    pubsub.publish(ON_NEW_TODO, newTodo);
    return newTodo;
  },
  removeTodo: function(root, { id }: { id: string }, context: Context) {
    pubsub.publish(ON_REMOVE_TODO, id);
    return context.db.removeTodo(id);
  },
  toggleTodo: function(root, { id }: { id: string }, context: Context) {
    const newTodo = context.db.toggleDone(id);
    pubsub.publish(ON_NEW_TODO, newTodo);
    return newTodo;
  }
};
