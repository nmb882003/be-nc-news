# NC-News

## About

This is a web API serving news articles. It was built using the [Express](https://expressjs.com/) web framework and is designed to mimic the structure of a real-world back-end service, such as Reddit.

A Heroku hosted version of this project can be found at: https://neilb-nc-news-server.herokuapp.com/api.

&nbsp;

---

## Installation

Start by forking this repository in GitHub and then clone it to your local machine. 

Once done, make sure you are in the root directory and then enter the following at the command line: 

    > npm i 
  

This will install all the dependencies required to run the project.  

&nbsp;

---

## Setup


In order to create both test and development databases, you will first need to create two `.env` files in the root directory of the repository; save these as `.env-development` and `.env-test`.

The files must contain the following information:

    //.env.development
    PGDATABASE=nc_news

    // env.test
    PGDATABASE=nc_news_test

Then, to create the databases on your local hard drive, enter the following at the command line:

    > npm run setup-dbs

&nbsp;

---

## Seeding the database

Before you can make calls to the API, you must first seed the database: 

    > npm run seed

This will populate the development database with data.

&nbsp;

---

## Launching the app

To launch the app, run the following command:  

    > npm start

By default, the app listens for incoming requests on port 9090. This can be changed in `listen.js`.
 
&nbsp;

---

## Testing

The project was built following TDD principles and tested using Jest and SuperTest. 

Test files can be found in `__tests__/`.

To launch the tests, enter the following at the command line:

    > npm run test


The test database will be re-seeded automatically each time the tests are run so you do not need to concern yourself with doing this manually. 

&nbsp;

---

## Requirements


This project requires that you have at least the following minimum versions of PostgreSQL and Node.js installed:

    PostgreSQL v12.11
    Node.js v17.8
