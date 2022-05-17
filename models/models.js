const db = require('../db/connection.js');

exports.extractTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        const topicsData = rows;
        console.log(topicsData);
        return topicsData;
    })
};

exports.extractArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        if (rows.length) return rows[0];
        else return Promise.reject("Invalid entry");
    });
}