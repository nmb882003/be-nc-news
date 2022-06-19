# NC-News

## About

This is a web API serving news articles. It was built using the [Express](https://expressjs.com/) web framework and is designed to mimic the structure of a real-world back-end service, such as Reddit.

A Heroku hosted version of this project can be found at: https://neilb-nc-news-server.herokuapp.com/api.


---

## Installation

Start by forking this repository in GitHub and then clone it to your local machine. 

Once done, make sure you are in the root directory and then enter the following at the command line: 

    > npm i 
  

This will install all the dependencies required to run the project.  

---

## Setup

In order to connect to the test and development databases, you will need to create two `.env` files, `.env-development` and `.env-test`, in the root directory of this repository. A .env file has been provided for you as an example.

The files must contain the following information:

    //.env.development
    PGDATABASE=nc_news

    // env.test
    PGDATABASE=nc_news_test

Then, to create the databases on your local hard drive, enter the following at the command line:

    > npm run setup-dbs

---
## Seeding the database

Before you can make calls to the API, you must first seed the database: 

    > npm run seed

This will populate the development database with data.

---

## Testing

The project was built following TDD principles and tested using Jest and SuperTest. 

Test files can be found in `__tests__/`.

To launch the tests, enter the following at the command line:

    > npm run test



---

## Requirements

This project requires that you have at least the following minimum versions of PostgreSQL and Node.js installed:

    PostgreSQL v12.11
    Node.js v17.8
