# Welcome to Lucidity !!

This is an application to ease the creation of digital and live art.

![live coding](http://i65.tinypic.com/wk011w.png)

https://github.com/luciditeam/lucidity/wiki/Lucidity

Development news on [twitter](http://twitter.com/lucidityio).

# Project status

This project is going through a major rewrite to:

1. support literate programming
2. better support event based (reactive) programming
3. better support large processing trees
4. create reusable modules (text editor, graph editor, compiler)

## Install dependencies

    npm install

## Run the live-reload server (needed for NW.js app)

Start server and head to http://localhost:8080.

    npm run dev

## Start app (requires npm run dev)

This runs the NW.js standalone app with access to filesystem live-coding.

    (npm run build)
    npm run dev ## in another terminal: needs to continue running
    npm run app

## Run the tests

Start server and head to http://localhost:8080/test.html.

    npm run dev

When adding new `.spec.ts` files, you need to update the tests bootstrap file with:

    npm run maketests

## Build for production

The files will go inside the 'build' directory. This needs further development and testing.

    npm run build

# Vocabulary

The part of the app that does the rendering of user projects is called Playback. Work in Lucidity is organized by projects.

A **Project** is made of a name, some access rights, scenes, helper code (project level functions), assets, and controllers.

A **Scene** is made of a name and a processing (directed) graph.

A **Graph** is made of a list of nodes.

A **Node** is a vertex in the graph and contains pointers to other nodes (one parent, many children). The node also contains a pointer to a **Block**.

A **Block** can be a single script file, multiple interdependent files (fragment shader + vertex shader, etc) or a sub Graph. Clicking on a node in the graph reveals an editor for the related block with specialized tabs (edit code, tweak values with sliders, custom edit views).

Some **Block** elements do not have inputs and outputs (external dependencies for example) and they can only live in the pool or assets.

The **Library** contains tagged blocks.

Project-level blocks are stored in the **Pool**. Blocks in the pool can be referenced from blocks in the graph through the context.

Other elements required to run a project such as videos, images, dependencies (THREE.js, etc) are stored in **assets**. This stores references to external elements. The actual files are stored in the user's dropbox ? on lucidity website ? To be clarified.
