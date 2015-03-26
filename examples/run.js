var dirBuster = require('../src');
var Writable = require('stream').Writable;

var options = {
    list: '../lists/directory-list-2.3-small.txt',
    outStream: new Writable({
        decodeStrings: false,
        objMode: false
    }),
    url: 'http://www.sapo.pt',
    export: 'json'
};

options.outStream.on('error', function(err) {
    console.log('err: ', err);
});

options.outStream._write = function (chunk, enc, next) {
    console.log('out', chunk.toString('utf8'));
    next();
};

dirBuster(options);
