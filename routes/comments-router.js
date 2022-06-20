const { deleteCommentById, patchCommentVotesById } = require('../controllers/controllers');

const commentsRouter = require('express').Router();

commentsRouter.patch('/:comment_id', patchCommentVotesById);

commentsRouter.delete('/:comment_id', deleteCommentById);

module.exports = commentsRouter;