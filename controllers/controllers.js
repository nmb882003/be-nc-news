const { extractTopics } = require(`../models/models.js`);

exports.getTopics = (req, res) => {
    extractTopics()
    .then(topicsData => {
        res.status(200).send(topicsData);
    })
    .catch(error => console.log("Oh no!", error));
}

exports.getInvalidPath = (req, res, next) => {
    res.status(404).send({msg: "Route does not exist"});
};