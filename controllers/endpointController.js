const { extractEndpointData } = require('../models/endpointModel.js');

exports.getEndpointData = (req, res, next) => {
    extractEndpointData()

        .then(endpointsMap => {
            res.status(200).send({ endpointsMap });
        })
        .catch(next);
}