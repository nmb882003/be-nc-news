const { getTopics, getArticleById, getInvalidPath } = require(`./controllers/controllers.js`);

const express = require('express');
const app = express();

app.get('/api/topics', getTopics);

app.get(`/api/articles/:article_id`, getArticleById);

app.get(`/*`, getInvalidPath);

app.listen(9090, () => {
    console.log(`Server is listening on port 9090...`);
});

module.exports = app;