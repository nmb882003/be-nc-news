const db = require('../db/connection.js');

exports.extractTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => rows);
};

exports.extractArticleById = (article_id) => {
    return db.query(`SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id  WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])

    .then(({rows}) => {
        if (rows.length) {
            return rows[0];
        }
        else return Promise.reject({ errStatus: 404, msg: "Entry not found"});
    });
};

exports.updateArticleVotesById = (article_id, body) => {
        return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [body.inc_votes, article_id])
        .then(({rows}) => {
            if (rows.length) return rows[0];
            else return Promise.reject({ errStatus: 404, msg: "Entry not found"});
        });
};

exports.extractUsers = () => {
    return db.query(`SELECT username FROM users`)
    .then(({rows}) => rows)
};

exports.extractArticles = () => {
    return db.query(`SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`)

    .then(({rows}) => {
        const noBodyRows = rows.map(article => {
            delete article.body;
            return article;
        })
        return noBodyRows;
    })
};

exports.extractArticleCommentsById = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])

    .then(({rows}) => {
        if (rows.length) {
            return rows;
        }
        else return Promise.reject({ errStatus: 404, msg: "Entry not found"});
    })
};