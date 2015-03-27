var fs = require('fs');
var path = require('path');
var collectors = require('./lib/collectors');
var generators = require('./lib/generators');
var exporters = require('./lib/exporters');
var stream = require('stream');
var combinedStream = require('combined-stream');
var Funil = require('funil');
var directories = require('./lib/directories');

module.exports = buster;

function buster(options) {

    var genStreams = [];

    /// Check dirs recursively

    var counterStarted = 0;
    var counterEnded = 0;

    var dirPathStream = pathStream(options.list);
    var checkDirStream = directories.checkDir(options.url, foundDir);
    checkDirStream.on('end', finished);
    //dirPathStream.on('end', finished);
    dirPathStream.pipe(checkDirStream);
    dirPathStream.resume();

    counterStarted++;

    function foundDir(path) {
        counterStarted++;
        //console.log('- ', path);
        var nextDirPathStream = pathStream(options.list);
        var prefixStreamA = directories.prefix(path);
        var prefixStreamB = directories.prefix(path);
        // nextDirPathStream.pipe(process.stdout);
        nextDirPathStream.pipe(prefixStreamA);
        nextDirPathStream.pipe(prefixStreamB);

        prefixStreamB.pause();
        genStreams.push(prefixStreamB);

        var nextCheckDirStream = directories.checkDir(options.url, foundDir);
        nextCheckDirStream.on('end', finished);
        //nextDirPathStream.on('end', finished);
        prefixStreamA.pipe(nextCheckDirStream);
        nextDirPathStream.resume();
    }

    function finished() {
        console.log('finished<-');
        counterEnded++;

        if (counterStarted === counterEnded) {
            smash();
        }
    }

    function smash() {

        var mainPathStream = pathStream(options.list);
        genStreams.push(mainPathStream);

        /// attach the collectors

        var collectorsFunil = new Funil();
        collectorsFunil.setMaxListeners(0);

        console.log('GEN STREAMS:', genStreams.length);

        options.methods.forEach(function(method) {
            switch (method) {
                case 'GET':
                    var collectorGet = collectors.get(options.url);
                    collectorGet.setMaxListeners(0);
                    genStreams.forEach(function(genStream) {
                        genStream.pipe(collectorGet);
                    });
                    collectorsFunil.add(collectorGet);
                    break;
                case 'POST':
                    var collectorPost = collectors.post(options.url);
                    collectorPost.setMaxListeners(0);
                    genStreams.forEach(function(genStream) {
                        genStream.pipe(collectorPost);
                    });
                    collectorsFunil.add(collectorPost);
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

        exportStream.setMaxListeners(0);

        collectorsFunil
            //.pipe(process.stdout);
            .pipe(exportStream)
            .pipe(options.outStream);

        genStreams.forEach(function(s) {
            s.resume();
        });

    }

}

function pathStream(list) {
    var ps = new stream.Transform({objectMode: true});
    ps._transform = function(data, enc, callback) {callback(null, data);};
    ps.pause();

    if (list) {
        var listStream = fs.createReadStream(
            path.resolve(__dirname, list));

        listStream
            .pipe(generators.liner())
            .pipe(generators.cleaner())
            .pipe(ps);
    } else {
        // pipe the fuzzer stream to the pause stream
    }

    return ps;
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
