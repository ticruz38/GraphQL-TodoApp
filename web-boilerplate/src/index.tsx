import "./antd.less";
import "./index.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, Store } from "redux";
import { BrowserRouter } from "react-router-dom";
import reducers from "src/store/reducers";
import { Provider, connect } from "react-redux";
import { IntlProvider } from "react-intl";
import { ApolloProvider } from "react-apollo";
import messages from "i18n";
import { client } from "src/config/ApolloClient";
import { Layout } from "src/components";
import { AppState } from "./store/reducers/app";

export const store: Store<any> = createStore(reducers);

// connect(mapStateToProps, mapDispatchToProps)
// const mapStateToProps =
const mapStateToProps = (store: { app: AppState }) => ({
  lang: store.app.lang
});

const App = connect(mapStateToProps)((props: { lang: string }) => (
  <IntlProvider locale="en" key={props.lang} messages={messages[props.lang]}>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Layout />
      </ApolloProvider>
    </BrowserRouter>
  </IntlProvider>
));

const RenderedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.hydrate(<RenderedApp />, document.querySelector("#app"));
