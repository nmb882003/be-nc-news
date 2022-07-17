const { readFile } = require('fs/promises');

exports.extractEndpointData = () => {
    return readFile(`./endpoints.json`, `utf8`)

        .then(fileData => JSON.parse(fileData));
}