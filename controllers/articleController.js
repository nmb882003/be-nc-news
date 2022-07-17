const { extractArticles, extractArticleById, extractArticleCommentsById, insertArticle, insertArticleCommentById, updateArticleVotesById, removeArticleById } = require('../models/articleModel.js');

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

exports.patchArticleVotesById = (req, res, next) => {
    const { article_id } = req.params;
    const { body } = req;

    updateArticleVotesById(article_id, body)

        .then(updatedArticle => {
            res.status(200).send({ updatedArticle });
        })
        .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
    const { article_id } = req.params;

    removeArticleById(article_id)

        .then(() => {
            res.status(204).send({});
        })
        .catch(next)
}