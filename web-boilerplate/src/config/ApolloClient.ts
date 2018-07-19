import { notification } from "antd";
import { InMemoryCache } from "apollo-cache-inmemory";
import { CachePersistor } from "apollo-cache-persist";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { onError } from "apollo-link-error";
import { WebSocketLink } from "apollo-link-ws";
import { getOperationAST } from "graphql";
import messages from "i18n";
import { store } from "src";

const cache = new InMemoryCache({
  addTypename: true
}).restore(window["__APOLLO_STATE__"]);

const persistor = new CachePersistor({
  cache,
  storage: window.sessionStorage,
  maxSize: false
});
// }

// ensure the data fetched from server is merged into localstorage cache
persistor.restore().then(_ => persistor.persist());

const batchLink = new BatchHttpLink({
  uri: HTTP_GRAPHQL_URL,
  credentials: PRODUCTION ? "same-origin" : "include",
  batchInterval: 20
});

const wsLink = new WebSocketLink({
  uri: WS_GRAPHQL_URL,
  options: {
    reconnect: true
  }
});

notification.config({ placement: "bottomRight" });
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.map(err => {
      notification["error"]({
        key: err.message,
        message: "Error",
        description: messages[store.getState().app.lang][err.message]
      });
    });
  }
});

const link = ApolloLink.split(
  (op: any) => {
    // check if it is a subscription
    const operationAST = getOperationAST(op.query, op.operationName);
    return !!operationAST && operationAST.operation === "subscription";
  },
  wsLink,
  batchLink
);

export const client = new ApolloClient({
  cache,
  link: ApolloLink.from([errorLink, link]),
  connectToDevTools: true
});
