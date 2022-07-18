const db = require('../db/connection.js');
const format = require("pg-format");

exports.extractArticles = (queries) => {
    const { sorted_by = "created_at", order = "desc", topic = "", limit = "10", p = "1" } = queries;
    let countQueryString = "", queryString = "";
    let queryValue = [];

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

    countQueryString += `SELECT COUNT(*) FROM articles`;
    queryString += `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

    if (!["article_id", "title", "topic", "author", "body", "created_at", "votes"].includes(sorted_by)) {
        return Promise.reject({ errStatus: 400, msg: `Invalid sort query: '${sorted_by}' should be a valid column name` })
    }

    if (!["asc", "desc"].includes(order)) {
        return Promise.reject({ errStatus: 400, msg: `Invalid order query: should be either 'asc' or 'desc'` })
    }

    if ((!/^[\d]+$/.test(p)) || (!/^[\d]+$/.test(limit))) {
        return Promise.reject({ errStatus: 400, msg: `Invalid request: 'p' and 'limit' queries must be integer numerical values` })
    }

    if (topic !== "") {
        countQueryString += ` WHERE topic = $1;`;
        queryString += ` WHERE topic = $1 `;
        queryValue.push(topic);
    }

    queryString += ` GROUP BY articles.article_id ORDER BY ${sorted_by} ${order.toUpperCase()} OFFSET ${(parseInt(p) - 1) * parseInt(limit)} ROWS FETCH NEXT ${parseInt(limit)} ROWS ONLY;`;

    const countQueryPromise = db.query(countQueryString, queryValue);
    const queryPromise = db.query(queryString, queryValue);

    return Promise.all([countQueryPromise, queryPromise])

        .then(([countQueryData, queryData]) => {
            const { count } = countQueryData.rows[0];
            const { rows } = queryData;

            if (count === "0") {
                return checkTopicExists(topic);
            }
            const modifiedRows = rows.map(article => {
                article.total_count = count;
                delete article.body;
                return article;
            });
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

exports.extractArticleCommentsById = (article_id, queries) => {
    const { p = 1, limit = 10 } = queries;

    if ((!/^[\d]+$/.test(p)) || (!/^[\d]+$/.test(limit))) {
        return Promise.reject({ errStatus: 400, msg: `Invalid request: 'p' and 'limit' queries must be numerical values` })
    }

    return db.query(`SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1`, [article_id])

        .then(({ rows }) => {
            if (rows.length) {
                return rows.slice((parseInt(p) - 1) * parseInt(limit), parseInt(p) * parseInt(limit));
            }
            else return Promise.reject({ errStatus: 404, msg: "No comments found" });
        });
};

exports.insertArticle = (bodyObj) => {
    const { author, title, body, topic } = bodyObj;

    if (typeof author !== "string" || typeof title !== "string" || typeof body !== "string" || typeof topic !== "string") {
        return Promise.reject({ errStatus: 400, msg: "Invalid request: malformed body object" });
    }

    const toBeInserted = [title, topic, author, body];
    const queryString = format(`INSERT INTO articles (title, topic, author, body) VALUES (%L) RETURNING *;`, toBeInserted);

    return db.query(queryString)
        .then(({ rows }) => {
            rows[0].comment_count = 0;
            return rows[0]
        })
}

exports.insertArticleCommentById = (article_id, bodyObj) => {
    const { body, username } = bodyObj;

    if (typeof body !== "string" || typeof username !== "string") return Promise.reject({ errStatus: 400, msg: "Invalid request: malformed body object" });

    const toBeInserted = [body, article_id, username, 0, new Date()];
    const queryString = format(`INSERT INTO comments (body, article_id, author, votes, created_at) VALUES (%L) RETURNING *;`, toBeInserted);

    return db.query(queryString)
        .then(({ rows }) => rows[0])
};

exports.updateArticleVotesById = (article_id, bodyObj) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [bodyObj.inc_votes, article_id])
        .then(({ rows }) => {
            if (rows.length) return rows[0];
            else return Promise.reject({ errStatus: 404, msg: "Article not found" });
        });
};

exports.removeArticleById = (article_id) => {
    return db.query(`DELETE FROM comments WHERE article_id = $1;`, [article_id])
        .then(({ rowCount }) => {
            return db.query(`DELETE FROM articles WHERE article_id = $1;`, [article_id])
        })

        .then(({ rowCount }) => {
            if (!rowCount) {
                return Promise.reject({ errStatus: 404, msg: "Article not found" });
            }
        })
}