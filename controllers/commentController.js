const { updateCommentVotesById, removeCommentById } = require(`../models/commentModel.js`);

exports.patchCommentVotesById = (req, res, next) => {
    const { comment_id } = req.params;
    const { body } = req;

    updateCommentVotesById(comment_id, body)

        .then(updatedComment => {
            res.status(200).send({ updatedComment });
        })
        .catch(next);
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    removeCommentById(comment_id)

        .then(() => {
            res.status(204).send({});
        })
        .catch(next);
};