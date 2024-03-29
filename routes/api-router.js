const { getEndpointData } = require('../controllers/endpointController.js');
const apiRouter = require('express').Router();
const articlesRouter = require('./articles-router.js');
const topicsRouter = require('./topics-router.js');
const usersRouter = require('./users-router.js');
const commentsRouter = require('./comments-router');

apiRouter.use('/users', usersRouter);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.get('/', getEndpointData);

module.exports = apiRouter;