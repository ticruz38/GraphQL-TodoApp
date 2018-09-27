## Introduction

This package has to be used with a graphql server, here graph-boilerplate. Please start the graphql server first.

## Get Started

Generate types (this step has to be made manually at first), this will generate the graphql-typings.d.ts file

- `yarn types`

Build the app

- `yarn build:web`

Launch the app

- `yarn start:web` or play "web" in vscode debugger
- Launch the browser on localhost:2121 or play "launch chrome" in vscode debugger

## Configuration

This application is configurable through environment variables. The .env file is meant for dev purpose and is not used for production environment.
Override variables in .env at your own need, you will need to restart webpack after modifying env variables.
