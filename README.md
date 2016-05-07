# editor

> Lucidity Editor

## Install dependencies

    npm install
    jspm install

## Run the jspm live-reload server

Run one of these two following commands and open http://localhost:8080.

There is currently a bug and the page does not reload on changes. These are detected by webpack-dev-server but the change is not injected. See: https://webpack.github.io/docs/webpack-dev-server.html.

View the app as in production by pre-building the js bundle (fastest reload).

    npm run dev

Live-server using jspm (slower reloads).

    npm run jspm

## Run the tests

Start the live server

    npm run dev

And open http://localhost:8080/unit-tests.html.

When adding new `.spec.ts` files, you need to update the tests bootstrap file with:

    npm run maketests

## Rebuild SCSS

    npm run sass

## Build for production

The files will go inside the 'public' directory.

    npm run build
