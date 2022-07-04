const { extractTopics, extractUsers, extractUserByUsername, extractArticles, extractArticleById, extractArticleCommentsById, extractEndpointData, insertArticle, insertArticleCommentById, insertTopic, updateArticleVotesById, updateCommentVotesById, removeCommentById } = require(`../models/models.js`);

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
    const queries = req.query;
    extractArticles(queries)

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
    const queries = req.query;

    extractArticleCommentsById(article_id, queries)

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

exports.postArticle = (req, res, next) => {
    const { body } = req;

    insertArticle(body)
        .then(postedArticle => {
            res.status(201).send({ postedArticle })
        })
        .catch(next)
}

exports.postArticleCommentById = (req, res, next) => {
    const { article_id } = req.params;
    const { body } = req;

    insertArticleCommentById(article_id, body)
        .then(postedComment => {
            res.status(201).send({ postedComment });
        })
        .catch(next)
};

exports.postTopic = (req, res, next) => {
    const { body } = req;

    insertTopic(body)
        .then(postedTopic => {
            res.status(201).send({ postedTopic });
        })
        .catch(next)
}

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

