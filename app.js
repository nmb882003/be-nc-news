const { getTopics, getArticleById, getInvalidPath, patchArticleVotesById } = require(`./controllers/controllers.js`);

const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get(`/api/articles/:article_id`, getArticleById);

app.get(`/*`, getInvalidPath);

app.patch(`/api/articles/:article_id`, patchArticleVotesById);

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid request' });
    } 
    else next(err);
})

app.use((err, req, res, next) => {
    if ((err.errStatus) && (err.msg)) {
        res.status(err.errStatus).send({ msg: err.msg });
    }
    else next(err);
})

app.use((err, req, res, next) => {
    console.log(err);
    
    res.status(500).send({ msg: 'Internal server error' });
});

app.listen(8080, () => {
    console.log(`Listening on port 8080`);
});

module.exports = app;