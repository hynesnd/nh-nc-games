# Neil's Northcoders House of Games API project

## Introduction

Hi! Welcome to my House of Games API project!

## My hosted project can be found at https://nh-nc-games.herokuapp.com/api

## Project summary

This project mimics the building of a real world back-end service similar to reddit.
It aims to demonstrate:

- Use of a node.js web server app,
- Underpinning postGresSQL database
- Use of MVC architecture
- Proper error handling.
- Implementation of the above through Test Driven Development.

It is written using:

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/) as web server app framework.
- [postGresSQL](https://www.postgresql.org/) as the underpinning database.
- [Node-PG](https://www.npmjs.com/package/pg) for interacting with postGres.
- [Jest](https://jestjs.io/), [jest-sorted](https://www.npmjs.com/package/jest-sorted) & [supertest](https://www.npmjs.com/package/supertest) for TDD testing.
- [Github](https://github.com/) and [Heroku](https://heroku.com/) for git version control and hosting.

## Minimum prerequisites for running this project

You will need to have the following software installed to download and work with this project:

- Node.js v16.8.0 - Install instructions [Here](https://nodejs.dev/learn/how-to-install-nodejs)
- postGreSQL v12.8, server 10.18 - Install instructions [Here](psql-install-instructions.md)
- A code editor such as [VSCode](https://code.visualstudio.com/)

## Cloning and testing this project

1. To begin, run the following bash command in the directory you would like the repo to be located:

```bash
git clone https://github.com/hynesnd/nh-nc-games.git
```

enter your git login details and token.

2. Open the repo folder in VSCode or your code editor of choice. Next, open a terminal in your code editor and run the following commands:

```bash
npm install
npm install --dev
```

This will install all node packages required for normal running of the repo, including devDependencies such as the testing modules.

3. To set up the development and testing databases to underpin the server app run this command:

```bash
npm run setup-dbs
```

This will create the databases `nc_games` and `nc_games_test` in your local instance of pSQL

4. Next, we need to create two `.env` environment files which will direct our databse connection code to connect to the correct database while testing or working with our development database.
   in the root directory of the repo, create the following two files:

- `.env.development`:
  edit the file to add a single line:

```env
PGDATABASE=nc_games
```

- `.env.test`:
  edit the file to add a single line:

```env
PGDATABASE=nc_games_test
```

5. When these files have been produced, we can run the seed script to populate our development database! Run the following command:

```bash
npm run seed
```

6. We're now ready to run some of the tests contained in `__tests__/app.test.js` ! to execute them run the following command:

```bash
npm test app
```
