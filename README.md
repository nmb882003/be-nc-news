# NC-News

## About

This is a web API serving news articles. It was built using the [Express](https://expressjs.com/) web framework and is designed to mimic the structure of a real-world back-end service, such as Reddit. 

The `endpoints.json` file in the root directory provides a map of all endpoints exposed by the API.

A Heroku hosted version of this project can be found at: https://neilb-nc-news-server.herokuapp.com/api.

---

## Installation

Start by forking this repository in GitHub and then clone it to your local machine. 

Once done, enter the following at the command line: 

`> npm i` 
  

This will install all the dependencies required to run the project.  

---

## Setup

In order to connect to the test and development databases, you will need to create two `.env` files in the root directory of this repository. An example `.env` file has been provided for you.

Your .env files should each contain the following code:

    //.env.development
    PGDATABASE=nc_news

    // env.test
    PGDATABASE=nc_news_test

---

## Seeding the database



---

## Testing

The project was built using TDD and tested using `jest` and `supertest`. 

Test files can be found in the `__tests__`  directory.

---

## Requirements

This project requires that you have at least the following minimum versions of PostgreSQL and Node.js installed:

    PostgreSQL v12.11
    Node.js v17.8
