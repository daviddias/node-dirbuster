var fs = require('fs');
var path = require('path');
var liner = require('./lib/liner');
var collect = require('./lib/collect');
var cleaner = require('./lib/list-clean');

module.exports = dirBuster;

function dirBuster(options) {
    var listStream = fs.createReadStream(
            path.resolve(__dirname, options.listPath));

    listStream
        .pipe(liner)
        .pipe(cleaner)
        .pipe(collect(options.url))
        .pipe(options.outStream);
}
