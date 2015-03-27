var fs = require('fs');
var path = require('path');
var collectors = require('./lib/collectors');
var generators = require('./lib/generators');
var exporters = require('./lib/exporters');
var stream = require('stream');
var combinedStream = require('combined-stream');
var Funil = require('funil');

module.exports = buster;

function buster(options) {

    var ps = new stream.Transform({objectMode: true});
    ps._transform = function(data, enc, callback) {callback(null, data);};

    ps.pause();

    if (options.list) {
        var listStream = fs.createReadStream(
            path.resolve(__dirname, options.list));

        listStream
            .pipe(generators.liner)
            .pipe(generators.cleaner)
            .pipe(ps);

    } else {
        // pipe the fuzzer stream to the pause stream
    }

    /// recursive

    /// filter here with HEAD

    var f = new Funil();

    options.methods.forEach(function(method) {
        switch (method) {
            case 'GET':
                var collectorGet = collectors.get(options.url);
                ps.pipe(collectorGet);
                f.add(collectorGet);
                break;
            case 'POST':
                var collectorPost = collectors.post(options.url);
                ps.pipe(collectorPost);
                f.add(collectorPost);
                break;
            case 'PUT':
                break;
            case 'DELETE':
                break;

        }
    });

    /// pick here the right exportStream

    var exportStream;

    switch (options.export) {
        case 'txt':
            break;
        case 'xml':
            break;
        case 'csv':
            break;
        default:
            exportStream = exporters.toJSON;
            break;
    }

    f
        .pipe(exportStream)
        .pipe(options.outStream);

    ps.resume();
}

/* options
 *
 * nRequests - number of requests in paralell
 * methods - array with selected methods ['HEAD','GET','POST','PUT','DELETE']
 * export - string with one of the following 'csv', 'json', 'txt', 'xml'
 * url - protocol+hostname (e.g http://daviddias.me)
 * list - path to the list that should be used, if none, then a fuzzer is used
 * out - path or writable stream of where the output should go
 */
