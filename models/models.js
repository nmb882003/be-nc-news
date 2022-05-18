const db = require('../db/connection.js');

exports.extractTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then((data) => {
        const topicsData = data.rows;
        return topicsData;
    })
};

exports.extractArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        if (rows.length) return rows[0];
        else return Promise.reject({ errStatus: 404, msg: "Entry not found"});
    });
};

exports.updateArticleVotesById = (article_id, body) => {
    console.log(body);
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        if (rows.length) {
            rows[0].votes += body.inc_votes;
            return rows[0];
        }
        else return Promise.reject({ errStatus: 404, msg: "Entry not found"});
    });
} ;