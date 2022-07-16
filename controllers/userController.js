const { extractUsers, extractUserByUsername } = require(`../models/userModel.js`);

exports.getUsers = (req, res, next) => {
    extractUsers()

        .then(users => res.status(200).send({ users }))
};

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    extractUserByUsername(username)

        .then(user => res.status(200).send({ user }))
        .catch(next);
}