var stream = require('stream');
var fs = require('fs');
var path = require('path');
var generators = require('../generators');

function pathStream(list) {
    var ps = new stream.Transform({objectMode: true});
    ps._transform = function(data, enc, callback) {callback(null, data);};
    ps.pause();

    if (list) {
        var listStream = fs.createReadStream(
            path.resolve(process.cwd(), list));

        listStream
            .pipe(generators.liner())
            .pipe(generators.cleaner())
            .pipe(ps);
    } else {
        // pipe the fuzzer stream to the pause stream
    }

    return ps;
}

module.exports = pathStream;
