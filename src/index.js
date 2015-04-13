var fs = require('fs');
var collectors = require('./lib/collectors');
var generators = require('./lib/generators');
var createCheckDirStream = require('./lib/directories/checkDir');
var createPrefixStream = require('./lib/directories/prefix');
var exporters = require('./lib/exporters');
var stream = require('stream');
var combinedStream = require('combined-stream');
var Funil = require('funil');
var directories = require('./lib/directories');
var path = require('path');

module.exports = buster;

function buster(options) {

    var pathStream = createPathStream();
    pathStream.setMaxListeners(0);
    pathStream.pause();

    /// attach simple path stream
    var state = {
        main: false,
        prefix: 0,
        checkDir: options.depth ? true : false
    };

    var listStream = generators.createListStream(options.list);
    listStream.pipe(pathStream, {end: false}); 
    listStream.on('end', function() {
        state.main = true; 
        if (state.checkDir) {
            console.log('\nDO NOT HAPPEN\n'); 
            pathStream.end();
        } 
    }); 
    //pathStream.on('end', function(){
    //    console.log('PATH STREAM EMMITED END EVENT');
    //}); 

    listStream.resume();
    
    /// check for dirs 

    var anotherListStream = generators.createListStream(options.list);
    var checkDirStream = createCheckDirStream(options.url, foundDir);
    checkDirStream.setMaxListeners(0); 
    anotherListStream.pipe(checkDirStream, {end: false});
    anotherListStream.resume();

    function foundDir(dirPath) {
        console.log('dirPath: ', dirPath);
        //1. create a new list stream
        //2. create new prefix stream
        //3. prefix.on end to remove one from the counter
        //4. list pipe to prefix stream
        //5. prefix pipe to checkDirStream with end: false
        //6. increment the prefix counter
       
        var yetAnotherListStream = generators.createListStream(options.list);
        var prefixStream = createPrefixStream(dirPath);
        state.prefix += 1;
        prefixStream.on('end', function(){
            state.prefix -= 1; 
        });
        yetAnotherListStream.pipe(prefixStream);
        prefixStream.pipe(checkDirStream, {end: false});
        prefixStream.pipe(pathStream, {end: false});
        yetAnotherListStream.resume();
    }

    checkDirStream.on('drain', function() {
        console.log('\ndrain event\n');
        if (state.main && state.prefix === 0) {
            console.log('killing pathStream');
            pathStream.end(); 
        }
        //1. check if main is done
        //2. check if there are still prefixes going
        //3. if all go, call end on pathStream
    });

    /// attach the collectors

    var collectorsFunil = new Funil();
    collectorsFunil.setMaxListeners(0);

    var tfactor;
    if (options.throttle) {
        tfactor = (options.throttle / options.methods.length) + 1;
    }

    options.methods.forEach(function(method) {
        switch (method) {
            case 'HEAD':
                var collectorHead = collectors.head(options.url,
                        tfactor,
                        options.extension);
                collectorHead.setMaxListeners(0);
                pathStream.pipe(collectorHead);
                collectorsFunil.add(collectorHead);
                break;
            case 'GET':
                var collectorGet = collectors.get(options.url,
                        tfactor,
                        options.extension);
                collectorGet.setMaxListeners(0);
                pathStream.pipe(collectorGet);
                collectorsFunil.add(collectorGet);
                break;
            case 'POST':
                var collectorPost = collectors.post(options.url,
                        tfactor,
                        options.extension);
                collectorPost.setMaxListeners(0);
                pathStream.pipe(collectorPost);
                collectorsFunil.add(collectorPost);
                break;
            case 'PUT':
                var collectorPut = collectors.put(options.url,
                        tfactor,
                        options.extension);
                collectorPut.setMaxListeners(0);
                pathStream.pipe(collectorPut);
                collectorsFunil.add(collectorPut);
                break;
            case 'DELETE':
                var collectorDel = collectors.del(options.url,
                        tfactor,
                        options.extension);
                collectorDel.setMaxListeners(0);
                pathStream.pipe(collectorDel);
                collectorsFunil.add(collectorDel);
                break;
        }
    });

    /// pick here the right exportStream

    var exportStream;

    switch (options.export) {
        case 'txt': break;
        case 'xml': break;
        case 'csv': break;
        default: exportStream = exporters.toJSON; break;
    }

    exportStream.setMaxListeners(0);

    collectorsFunil
        .pipe(exportStream)
        .pipe(options.outStream);
    
    pathStream.resume();
}


function createPathStream() {
    var ps = new stream.Transform({objectMode: true});
    ps._transform = function(data, enc, callback) {callback(null, data);};
    ps.pause();

    return ps;
}

function createPrefixStream(prefix, listPath) {
    var ls = createListStream(listPath);

    var ps = new stream.Transform({objectMode: true});
    ps._transform = function(data, enc, callback) {
        callback(null, data);
    };
    
    ls.pipe(ps);  
    return ps; 
}
/*
function createCheckDirStream(dirFound) {
    var cds = new stream.Transform({objectMode: true});
    cds._transform = function(data, enc, callback) {
        callback(null, data);
    
    
    };
    
    return cds;
}
*/
