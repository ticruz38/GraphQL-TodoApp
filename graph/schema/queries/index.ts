import { Context } from "graph";

export default {
  // helloWorld: (root, args, context) => {
  //   return { id: "helloworld" };
  // },
  user: (root, args, context: Context) => {
    return context.session.user;
  },
  users: (root, args, context: Context) => {
    return context.db.users;
  },
  todos: (root, args, context: Context) => {
    return context.db.todos;
  }
};
