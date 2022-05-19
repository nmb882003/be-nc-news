const db = require('../db/connection.js');

exports.extractTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => rows);
};

exports.extractArticleById = (article_id) => {
    const articlePromise = db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id]);
    const commentsPromise = db.query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id]);

    return Promise.all([articlePromise, commentsPromise])

    .then(([articleData, commentsData]) => {
        const numberOfComments = commentsData.rows.length;

        if (articleData.rows.length) {
            articleData.rows[0].comment_count = numberOfComments;
            return articleData.rows[0];
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
}