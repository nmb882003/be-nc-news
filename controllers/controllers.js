const { extractTopics, extractArticleById, updateArticleVotesById, extractUsers, extractArticles, extractArticleCommentsById, insertArticleCommentById, removeCommentById, extractEndpointData } = require(`../models/models.js`);

exports.getTopics = (req, res, next) => {
    extractTopics()

    .then(topicsArray => res.status(200).send({topicsArray}))
};

exports.getUsers = (req, res, next) => {
    extractUsers()

    .then(usersArray => res.status(200).send({usersArray}))
};

exports.getArticles = (req, res, next) => {
    extractArticles(req.query)

    .then(articlesArray => {
        res.status(200).send({articlesArray});
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    extractArticleById(article_id)

    .then(article => {
        return res.status(200).send({article});
    })
    .catch(next);
};

exports.getArticleCommentsById = (req, res, next) => {
    const {article_id} = req.params;

    extractArticleCommentsById(article_id)

    .then(commentsArray => {
        res.status(200).send({ commentsArray });
    })
    .catch(next);
};

exports.getEndpointData = (req, res, next) => {
    extractEndpointData()

    .then(data => console.log(data));
}

exports.getInvalidPath = (req, res, next) => {
    res.status(404).send({ msg: "Route does not exist" });
};

exports.postArticleCommentById = (req, res, next) => {
    const {article_id} = req.params;
    const {body} = req;

    insertArticleCommentById(article_id, body)

    .then(postedComment => {
        res.status(201).send({ postedComment });
    })
    .catch(next)
};

exports.patchArticleVotesById = (req, res, next) => {
    const {article_id} = req.params;
    const {body} = req;

    updateArticleVotesById(article_id, body)

    .then(article => {
        res.status(200).send({article});
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;

    removeCommentById(comment_id)

    .then(() => {
        res.status(204).send({});
    })
    .catch(next);
};