var ncp = require('ncp').ncp;

ncp.limit = 16;

ncp("./src", "./dist", function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('Files Copied!');
});