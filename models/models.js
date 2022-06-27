const db = require('../db/connection.js');
const format = require("pg-format");
const { readFile } = require("fs/promises");

exports.extractTopics = () => {
    return db.query(`SELECT * FROM topics;`)
        .then(({ rows }) => rows);
};

exports.extractUsers = () => {
    return db.query(`SELECT username FROM users`)
        .then(({ rows }) => rows);
};

exports.extractUserByUsername = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1', [username])

        .then(({rows}) => {
            if (rows.length) {
                return rows[0];
            }
            else {
                return Promise.reject({
                    errStatus: 404,
                    msg: "User not found"
                })
            } 
        })
}

exports.extractArticles = (queries) => {
    const { sorted_by = "created_at", order = "desc", topic = "" } = queries;
    let queryString = "", queryValue = [];

    const checkTopicExists = (topicToCheck) => {
        return db.query(`SELECT * FROM topics WHERE slug = $1`, [topicToCheck])

            .then(({ rows }) => {
                if (rows.length) {
                    return Promise.reject({ errStatus: 404, msg: `No articles associated with topic '${topic}'` });
                }
                if (!rows.length) {
                    return Promise.reject({ errStatus: 400, msg: `Invalid topic query: '${topic}' should be a valid topic category` })
                }
            })
    }

    if (!["article_id", "title", "topic", "author", "body", "created_at", "votes"].includes(sorted_by)) {
        return Promise.reject({ errStatus: 400, msg: `Invalid sort query: '${sorted_by}' should be a valid column name` })
    }
    if (!["asc", "desc"].includes(order)) {
        return Promise.reject({ errStatus: 400, msg: `Invalid order query: should be either 'asc' or 'desc'` })
    }

    queryString += `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id `;

    if (topic !== "") {
        queryString += `WHERE topic = $1 `;
        queryValue.push(topic);
    }

    queryString += `GROUP BY articles.article_id ORDER BY ${sorted_by} ${order.toUpperCase()};`

    return db.query(queryString, queryValue)

        .then(({ rows }) => {
            if (!rows.length) {
                return checkTopicExists(topic);
            }
            const modifiedRows = rows.map(article => {
                delete article.body;
                return article;
            })
            return modifiedRows;
        });
};

exports.extractArticleById = (article_id) => {
    return db.query(`SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id  WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])

        .then(({ rows }) => {
            if (rows.length) {
                return rows[0];
            }
            else return Promise.reject({ errStatus: 404, msg: "Article not found" });
        });
};

exports.extractArticleCommentsById = (article_id) => {
    return db.query(`SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1`, [article_id])

        .then(({ rows }) => {
            if (rows.length) {
                return rows;
            }
            else return Promise.reject({ errStatus: 404, msg: "Article not found" });
        });
};

exports.extractEndpointData = () => {
    return readFile(`./endpoints.json`, `utf8`)

        .then(fileData => JSON.parse(fileData));
}

exports.insertArticle = (bodyObj) => {
    const { author, title, body, topic } = bodyObj;

    if (typeof author !== "string" || typeof title !== "string" || typeof body !== "string" || typeof topic !== "string") {
        return Promise.reject({ errStatus: 400, msg: "Invalid request"});
    }

    const toBeInserted = [title, topic, author, body];
    const queryString = format(`INSERT INTO articles (title, topic, author, body) VALUES (%L) RETURNING *;`, toBeInserted);

    return db.query(queryString)
        .then(({rows}) => {
            rows[0].comment_count = 0;
            return rows[0]
        })
}

exports.insertArticleCommentById = (article_id, body) => {
    const { post, username } = body;

    if (typeof post !== "string" || typeof username !== "string") return Promise.reject({ errStatus: 400, msg: "Invalid request" });

    const toBeInserted = [post, article_id, username, 0, new Date()];
    const queryString = format(`INSERT INTO comments (body, article_id, author, votes, created_at) VALUES (%L) RETURNING *;`, toBeInserted);

    return db.query(queryString)
        .then(({ rows }) => rows[0])
};

exports.updateArticleVotesById = (article_id, body) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [body.inc_votes, article_id])
        .then(({ rows }) => {
            if (rows.length) return rows[0];
            else return Promise.reject({ errStatus: 404, msg: "Article not found" });
        });
};

exports.updateCommentVotesById = (comment_id, body) => {
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [body.inc_votes, comment_id])
        .then(({ rows }) => {
           if (rows.length) return rows[0];
           else return Promise.reject({ errStatus: 404, msg: "Comment not found" });
        });
};

exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])

        .then(({ rowCount }) => {
            if (!rowCount) {
                return Promise.reject({ errStatus: 404, msg: "Comment not found" });
            }
        })
};