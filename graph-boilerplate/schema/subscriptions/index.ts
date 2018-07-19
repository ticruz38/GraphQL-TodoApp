import pubsub from "schema/PubSub";
import { withFilter } from "graphql-subscriptions";
export const ON_NEW_TODO = "ON_NEW_TODO";
export const ON_REMOVE_TODO = "ON_REMOVE_TODO";

export default {
  onNewTodo: {
    resolve: (payload, args, context, info) => {
      return payload;
    },
    // withfilter can be used to filter who get the subscription based on certain condition
    subscribe: withFilter(() => pubsub.asyncIterator(ON_NEW_TODO), (payload, variable) => true)
  },
  onRemoveTodo: {
    resolve: (payload, args, context, info) => {
      return payload;
    },
    subscribe: withFilter(() => pubsub.asyncIterator(ON_REMOVE_TODO), (payload, variable) => true)
  }
};
