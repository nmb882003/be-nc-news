const { getInvalidPath } = require('./controllers/invalidPathController.js');

const express = require('express');
const app = express();

const cors = require('cors');
const apiRouter = require('./routes/api-router.js');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.get(`/*`, getInvalidPath);

app.use((err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send({ msg: 'Invalid request' });
    } else if (err.code === '23503') {
        if (err.constraint === 'comments_author_fkey') {
            res.status(400).send({ msg: 'Invalid request - username not found' });
        } else if (err.constraint === 'comments_article_id_fkey') {
            res.status(404).send({ msg: 'Article not found' });
        } else if (err.constraint === 'articles_author_fkey') {
            res.status(400).send({ msg: 'Invalid request - author not found in users' });
        } else if (err.constraint === 'articles_topic_fkey') {
            res.status(400).send({ msg: 'Invalid request - topic not found in topics' });
        }
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
    res.status(500).send({ msg: 'Internal server error' });
    console.log(err);
});

module.exports = app;