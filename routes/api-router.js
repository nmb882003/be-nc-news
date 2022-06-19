const { getEndpointData } = require('../controllers/controllers.js');

const apiRouter = require('express').Router();
const articlesRouter = require('./articles-router.js');
const topicsRouter = require('./topics-router.js');

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.get('/', getEndpointData);

module.exports = apiRouter;