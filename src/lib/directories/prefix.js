var Transform = require('stream').Transform;

module.exports = function(path) { 
    var ts = new Transform({objectMode: true});

    ts._transform = function (chunk, encoding, done) {
        var data = chunk.toString();

        if(data.indexOf('/') === -1) {
            this.push(path + '/' + data);
            return done();
        } else {
            console.log('ignored');
            process.exit(1);
            return done(); 
        }
    };
    
    return ts;
};
