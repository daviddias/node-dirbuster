var Lab = require('lab');
var Code = require('code');
var lab = exports.lab = Lab.script();
var nock = require('nock');

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
        var scope = nock(url)
            .get('/index')
            .reply(200, 'Hello World!', {
                'X-My-Headers': 'My Header value'
            });

        var options = {
            list: './tests/micro-test-list.txt',
            outStream: process.stderr,
            url: url,
            methods: ['GET']
        };
        setTimeout(done, 2000);

        dirBuster(options);
    });

});
