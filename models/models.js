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
        const article = rows[0];
        return article;
    })
}