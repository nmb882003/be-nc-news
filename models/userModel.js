const db = require('../db/connection.js');

exports.extractUsers = () => {
    return db.query(`SELECT username FROM users`)
        .then(({ rows }) => rows);
};

exports.extractUserByUsername = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1', [username])

        .then(({ rows }) => {
            if (rows.length) {
                return rows[0];
            }
            else {
                return Promise.reject({
                    errStatus: 404,
                    msg: "User not found"
                })
            }
        })
}