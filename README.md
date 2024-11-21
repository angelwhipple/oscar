# 6.1040 Project: Oscar

## Getting Started

If you are using VSCode/VSCodium, install the ESLint and Prettier extensions.
The project is already configured to use ESLint and Prettier,
but feel free to add your own rules if you want.
Right now, the code is formatted on save; you can change this in `.vscode/settings.json`
by disabling `editor.formatOnSave`.

As well, you can install [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) extensions.

Run `npm install` to install dependencies.

## Local Dev Setup
**.env**   
`MONGO_SRV=mongodb+srv://admin:BcwC9PsKjrXlDag8@oscar.wmrb4.mongodb.net/?retryWrites=true&w=majority&appName=OSCAR`

## Running Locally
Using two seperate, dedicated terminals:

Run `npm run dev:server` to start the backend server.
This will automatically restart the server code if you make changes to it.
In active server development, we recommend you run `npm start:server`.

Run `npm run dev:client` to start the client server.
Changes to the client code should automatically recompile and hot-reload without needing to restart the client server.

Navigate to `http://localhost:5173` (or whatever port the client server shows in your terminal) to see your app.

## Creating a branch
```
git checkout main
git fetch origin && git pull
git checkout -b <branch-name>
git branch --set-upstream-to=origin/main <branch-name>
```

## Opening a pull request
```
git checkout main && git fetch
git checkout <branch-name> && git pull
git status
git add <files-to-add>
git commit -m 'commit message'
git push origin HEAD
```
- In future commits, you will only need to use `git push`
- You should receive a Github link to open the PR
   - Set `base: main`
   - Set `compare: <branch-name>`

## Approvals
Before your branch is merged with main, get 1 approval from a teammate

## Vercel
[Oscar](https://oscar-kappa.vercel.app/)

## Backend Server
The code for the backend server is under `server/` directory,
which includes both concept and RESTful API implementations.

Here's an overview of the files and directories.
First, concept implementations:
- `server/concepts` contains the concept implementations.
  Note that we try to keep concepts as modular and generic as possible.
- `server/concepts/errors.ts` contains the base error classes you can
  either directly use or extend from. You are free to add more base errors
  in that file if you need to
  (e.g., if your route needs to return [I am a teapot](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418) error).

Framework code:

- `framework/router.ts` contains the framework code that does the magic to convert your
  route implementations and error handling into Express handlers.
  Editing this file is not recommended.
- `framework/doc.ts` defines a convenient wrapper around MongoDB. You may want to edit this file.

Server implementation:

- `server/app.ts` contains your app definition (i.e., concept instantiations).
- `server/db.ts` contains the MongoDB setup code. You should not need to edit this file.
- `server/routes.ts` contains the code for your API routes.
  Try to keep your route definitions as simple as possible.
- `server/responses.ts` contains the code for formatting your responses and errors
  into a more user-friendly format for the front-end. For example, it would be better
  if your front-end receives `barish is not the author of this post` instead of
  `64e52a1f5ffc7d0d48a0569d is not the author of this post`.

And tests:

- `test` contains Mocha unit tests for the server.
