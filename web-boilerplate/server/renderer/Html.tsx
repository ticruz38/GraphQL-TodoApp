import * as React from "react";

export default ({ content, state }) => (
  <html>
    <head>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <title>Boilerplate</title>
      <meta name="description" content="" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href={STATIC_URL + "/app.css"} />
      <link rel="shortcut icon" href="/assets/icon/57x57.png" />
    </head>
    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__APOLLO_STATE__=${JSON.stringify(state)}`
        }}
        async
      />
      <script src={STATIC_URL + "/vendors.js"} />
      <script src={STATIC_URL + "/app.js"} />
    </body>
  </html>
);
