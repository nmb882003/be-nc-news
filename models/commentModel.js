const db = require('../db/connection.js');

exports.updateCommentVotesById = (comment_id, body) => {
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [body.inc_votes, comment_id])

        .then(({ rows }) => {
            if (rows.length) return rows[0];
            else return Promise.reject({ errStatus: 404, msg: "Comment not found" });
        });
};

exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])

        .then(({ rowCount }) => {
            if (!rowCount) {
                return Promise.reject({ errStatus: 404, msg: "Comment not found" });
            }
        })
};