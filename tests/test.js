var Lab = require('lab');
var Code = require('code');
var lab = exports.lab = Lab.script();
var nock = require('nock');
var Writable = require('stream').Writable;

var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var dirBuster = require('../src/index.js');

experiment(': ', function() {

    before(function(done) {
        done();
    });

    after(function(done) {
        done();
    });

    /*
        test HEAD
        test GET
        test POST
        test PUT
        test DELETE
        test extension
        test throttle
*/
    var url = 'http://test.url';

    test('cool test', function(done) {
        done();
    });

    test('GET collector', {timeout: 10000}, function(done) {
        var out = new Writable({
            decodeStrings: false,
            objMode: false
        });

        var results = [];

        setNocks();

        var options = {
            list: './tests/test-list.txt',
            outStream: out,
            url: url,
            methods: ['GET']
        };

        out._write = function(chunk, enc, next) {
            results.push(chunk.toString('utf8'));
            next();
        };

        out.on('finish', function() {
            done();
        });

        dirBuster(options);
    });

    function setNocks() {
        nock(url)
            .get('/index')
            .reply(200, 'Hello World!', {
                'X-My-Headers': 'My Header value'
            });

        nock(url)
            .get('/js')
            .reply(403, 'Hello World!', {
                'X-My-Headers': 'My Header value'
            });
    }

});
