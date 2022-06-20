const { extractTopics, extractUsers, extractUserByUsername, extractArticles, extractArticleById, extractArticleCommentsById, extractEndpointData, insertArticleCommentById, updateArticleVotesById, removeCommentById } = require(`../models/models.js`);

exports.getTopics = (req, res, next) => {
    extractTopics()

        .then(topics => res.status(200).send({ topics }))
};

exports.getUsers = (req, res, next) => {
    extractUsers()

        .then(users => res.status(200).send({ users }))
};

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    extractUserByUsername(username)

    .then(user => res.status(200).send({ user }))
    .catch(next);
}

exports.getArticles = (req, res, next) => {
    extractArticles(req.query)

        .then(articles => {
            res.status(200).send({ articles });
        })
        .catch(next);
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    extractArticleById(article_id)

        .then(article => {
            res.status(200).send({ article });
        })
        .catch(next);
};

exports.getArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params;

    extractArticleCommentsById(article_id)

        .then(comments => {
            res.status(200).send({ comments });
        })
        .catch(next);
};

exports.getEndpointData = (req, res, next) => {
    extractEndpointData()

        .then(endpointsMap => {
            res.status(200).send({ endpointsMap });
        })
        .catch(next);
}

exports.getInvalidPath = (req, res, next) => {
    res.status(404).send({ msg: "Route does not exist" });
};

exports.postArticleCommentById = (req, res, next) => {
    const { article_id } = req.params;
    const { body } = req;

    insertArticleCommentById(article_id, body)

        .then(postedComment => {
            res.status(201).send({ postedComment });
        })
        .catch(next)
};

exports.patchArticleVotesById = (req, res, next) => {
    const { article_id } = req.params;
    const { body } = req;

    updateArticleVotesById(article_id, body)

        .then(updatedArticle => {
            res.status(200).send({ updatedArticle });
        })
        .catch(next);
};

exports.patchCommentVotesById = (req, res, next) => {
    const { comment_id } = req.params;
    const { body } = req;

    updateCommentVotesById()

        .then(data => console.log(data));
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    removeCommentById(comment_id)

        .then(() => {
            res.status(204).send({});
        })
        .catch(next);
};