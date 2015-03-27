var transform = require('parallel-transform');
var request = require('request');

request.defaults({
    maxSockets: Infinity
});

module.exports = function(url, attachStream) {
    return transform(10, checkDir);

    function checkDir(data, callback) {
        var stream = this; 

        /// hack to avoid checking the same stream to infite
        var tmp = data.toString('utf8').trim();
        if (tmp.indexOf('/') === tmp.length -1 ) {
            //console.log('AVOID CHECKING SAME DIR: ', tmp);
            return callback();
        }

        var options = {};
        options.headers = {};
        options.path = ('/' + data.toString('utf8')).trim() + '/';
        options.url = url + options.path;
        options.followRedirect = false;
        options.pool = false; 
        options.method = 'HEAD';

        // console.log('DIR: ', options.path);

        request(options, verify);

        function verify(error, res, body) {
            if (error) {
                // console.log(options.path);
                // console.log('ERROR: ', error);
                return callback();
            }

            if (res.statusCode !== 404) {
                console.log('FOUND DIR: ', options.path);
                attachStream(data.toString('utf8').trim());
            }

            callback();
        }
    }
};
