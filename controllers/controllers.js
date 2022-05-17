const { extractTopics, extractArticleById } = require(`../models/models.js`);

exports.getTopics = (req, res) => {
    extractTopics()
    .then(topicsArray => {
        res.status(200).send(topicsArray);
    })
    .catch(error => console.log("Oh no!", error));
};

exports.getArticleById = (req, res) => {
    const {article_id} = req.params;
    extractArticleById(article_id)
    .then(article => {
        res.status(200).send(article);
    })
    .catch(error => console.log(error));
};

exports.getInvalidPath = (req, res, next) => {
    res.status(404).send({msg: "Route does not exist"});
};