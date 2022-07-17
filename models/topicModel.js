const db = require('../db/connection.js');
const format = require("pg-format");

exports.extractTopics = () => {
    return db.query(`SELECT * FROM topics;`)
        .then(({ rows }) => rows);
};

exports.insertTopic = (body) => {
    const { slug, description } = body;

    if ((typeof slug !== "string") || (typeof description !== "string")) {
        return Promise.reject({ errStatus: 400, msg: "Invalid request: malformed body object" });
    }
    const toBeInserted = [slug, description];
    const queryString = format(`INSERT INTO topics (slug, description) VALUES (%L) RETURNING *;`, toBeInserted);

    return db.query(queryString)
        .then(({ rows }) => {
            return rows[0];
        })
};