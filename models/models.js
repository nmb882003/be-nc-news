const db = require('../db/connection.js');

exports.extractTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        const topicsData = rows;
        console.log(topicsData);
        return topicsData;
    })
};