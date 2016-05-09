# Lucidity Editor

> An app for live arts.

## Install dependencies

    npm install

## Run the jspm live-reload server

Start server and head to http://localhost:8080.

    npm run dev

## Run the tests

Start server and head to http://localhost:8080/test.html.

    npm run dev

When adding new `.spec.ts` files, you need to update the tests bootstrap file with:

    npm run maketests

## Build for production

The files will go inside the 'build' directory. This needs further development and testing.

    npm run build
