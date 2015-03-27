var Transform = require('stream').Transform;

var toJSON = new Transform({objectMode: false});

toJSON._transform = function(chunk, encoding, done) {
    this.push(chunk);
    done();
};

module.exports = toJSON;
