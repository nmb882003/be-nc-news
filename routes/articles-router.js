const { getArticles, getArticleById, getArticleCommentsById } = require('../controllers/controllers.js');

const articlesRouter = require('express').Router();
const commentsRouter = require('./comments-router.js');

articlesRouter.get('/', getArticles);

articlesRouter.get('/:article_id', getArticleById);

articlesRouter.get('/:article_id/comments', getArticleCommentsById);

module.exports = articlesRouter;