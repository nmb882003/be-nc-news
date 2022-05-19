const { extractTopics, extractArticleById, updateArticleVotesById, extractUsers } = require(`../models/models.js`);

exports.getTopics = (req, res, next) => {
    extractTopics()
    .then(topicsArray => res.status(200).send({topicsArray}))
};

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    extractArticleById(article_id)
    .then(article => {
        return res.status(200).send({article});
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
    extractUsers()
    .then(usersArray => res.status(200).send({usersArray}))
};

exports.getInvalidPath = (req, res, next) => {
    res.status(404).send({ msg: "Route does not exist" });
};

exports.patchArticleVotesById = (req, res, next) => {
    const {article_id} = req.params;
    const {body} = req;
    updateArticleVotesById(article_id, body)
    .then(article => {
        return res.status(200).send({article});
    })
    .catch(next);
};