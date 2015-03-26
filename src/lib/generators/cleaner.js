var Transform = require('stream').Transform;

var cleaner = new Transform({objectMode: false});

cleaner._transform = function (chunk, encoding, done) {
    var data = chunk.toString();

    if(data.indexOf('#') === -1) {
        this.push(data); 
        done(); 
    } else {
        done();
    }
};

module.exports = cleaner;
