const { extractTopics, insertTopic } = require(`../models/topicModel.js`);

exports.getTopics = (req, res, next) => {
    extractTopics()

        .then(topics => res.status(200).send({ topics }))
};

exports.postTopic = (req, res, next) => {
    const { body } = req;

    insertTopic(body)
        .then(postedTopic => {
            res.status(201).send({ postedTopic });
        })
        .catch(next)
}