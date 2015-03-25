var transform = require('parallel-transform');
var http = require('http');
var T = require('stream').Transform;
var request = require('request');

request.defaults({
    maxSockets: Infinity
});

module.exports = function(url) {
    return transform(10, collector);


    function collector(data, callback) {
        var stream = this; 
        
        var options = {};
        options.headers = {};
        options.path = ('/' + data.toString('utf8')).trim();
        options.url = url + options.path;
        options.followRedirect = false;
        
        console.log('options', options); 

        options.hostname = 'www.sapo.pt';
        options.port = 80;
        //options.agent = false;

        var req = http.request(options, function(res) {
            console.log('a'); 
            callback(null, 'batata'); 
        }); 
        req.end();

        //get(options, push);


        function push(error, res, body) {
            console.log('baby got back'); 
            
            if (error) {
                console.log(error);
            }
            callback(null, JSON.stringify({
                type: 'file',
                method: options.method,
                statusCode: res.statusCode,
                path: options.path,
                size: res.headers['content-length']
            }));
        }
    }
};

function head() {}

function get(options, push) {
    options.method = 'GET'; 
    request(options, push);
}

function dir() { // to check if it is a dir
}
function post() {}

function put() {}

function del() {}

