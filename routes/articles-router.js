const { getArticles } = require('../controllers/controllers.js');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);

module.exports = articlesRouter;