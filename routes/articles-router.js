const { getArticles, getArticleById, getArticleCommentsById, postArticleCommentById, postArticle, patchArticleVotesById } = require('../controllers/controllers.js');
const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);

articlesRouter.get('/:article_id', getArticleById);

articlesRouter.post('/', postArticle);

articlesRouter.patch('/:article_id/', patchArticleVotesById);

articlesRouter.get('/:article_id/comments', getArticleCommentsById);

articlesRouter.post('/:article_id/comments', postArticleCommentById);

module.exports = articlesRouter;