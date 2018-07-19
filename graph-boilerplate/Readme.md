## Introduction

This module is meant to be consumed by a client, a web or mobile interface or both. The client in this boilerplate is the module web-boilerplate.

## Get Started

Generate types (this step has to be made manually at first), this will generate the graphql-typings.d.ts file

- `yarn types`

Build the app (with webpack)

- `yarn build:graph`

Start the server

- `yarn start:graph`

## Production

There is a dockerfile ready to be used, just run `docker build .` at the root of this package.

## Configuration

Only environment variable should be modified to change this module configuration. You can find the variable in .env file, those variables needs to be redefined in production environment as the .env will be ignored.
