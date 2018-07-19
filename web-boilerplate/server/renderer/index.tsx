import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { Router } from "express";
import * as React from "react";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import * as ReactDOM from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router";
import { createStore } from "redux";

import messages from "i18n";
import { Layout } from "src/components";
import reducers from "src/store/reducers";
import Html from "./Html";
import { IntlProvider } from "react-intl";

global["fetch"] = require("node-fetch");
global["window"] = { location: null };

const router = Router();

router.use((req: any, res) => {
  const store = createStore(reducers);
  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: GRAPHQL_SERVER_URL,
      credentials: "include",
      fetch: global["fetch"].default,
      headers: {
        ...req.headers,
        accept: "applicaton/json"
      }
    }),
    cache: new InMemoryCache({
      addTypename: true
    })
  });

  const App = (
    <Provider store={store}>
      <IntlProvider locale="en" key="en" messages={messages["en"]}>
        <StaticRouter location={req.url} context={{}}>
          <ApolloProvider client={client}>
            <Layout />
          </ApolloProvider>
        </StaticRouter>
      </IntlProvider>
    </Provider>
  );
  getDataFromTree(App)
    .then(_ => {
      const content = ReactDOM.renderToString(App);
      const initialState = client.extract();
      const html = <Html content={content} state={initialState} />;
      res
        .status(200)
        .send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`)
        .end();
    })
    .catch(error => {
      console.log(error);
      res.redirect("/login");
    });
});

export default router;
