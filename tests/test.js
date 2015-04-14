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
        test recursiveness
    */

    var url = 'http://test.url';

    test('cool test', function(done) {
        done();
    });

    test('GET collector', {timeout: 10000}, function(done) {
        var results = {};

        var out = createOutStream(results, function() {
            expect(results['/index']).to.equal(200);
            expect(results['/images']).to.equal(404);
            expect(results['/download']).to.equal(404);
            expect(results['/js']).to.equal(200);
            expect(results['/news']).to.equal(200);
            done();
        });

        setGETNocks();

        var options = {
            list: './tests/test-list.txt',
            outStream: out,
            url: url,
            methods: ['GET']
        };

        dirBuster(options);
    });

    function createOutStream(results, cb) {
        var out = new Writable({
            decodeStrings: false,
            objMode: false
        });

        out._write = function(chunk, enc, next) {
            var result = JSON.parse(chunk.toString('utf8'));
            results[result.path] = result.statusCode;
            next();
        };

        out.on('finish', cb);

        return out;
    }

    /* Routes
        index
        images
        download
        js
        news
    */

    function setGETNocks() {
        nock(url)
            .get('/index')
            .reply(200, 'Hello World!', {'X-My-Headers': 'My Header value'});

        nock(url)
            .get('/images')
            .reply(404, 'Hello World!', {'X-My-Headers': 'My Header value'});

        nock(url)
            .get('/download')
            .reply(404, 'Hello World!', {'X-My-Headers': 'My Header value'});

        nock(url)
            .get('/js')
            .reply(200, 'Hello World!', {'X-My-Headers': 'My Header value'});

        nock(url)
            .get('/news')
            .reply(200, 'Hello World!', {'X-My-Headers': 'My Header value'});
    }

    function setPOSTNocks() {

    }

    function setPUTNocks() {

    }

    function setDELETENocks() {

    }

    function setGETAndExtensionNocks() {
        nock(url)
            .get('/index.php')
            .reply(200, 'Hello World!', {'X-My-Headers': 'My Header value'});

        nock(url)
            .get('/images.php')
            .reply(404, 'Hello World!', {'X-My-Headers': 'My Header value'});

        nock(url)
            .get('/download.php')
            .reply(404, 'Hello World!', {'X-My-Headers': 'My Header value'});

        nock(url)
            .get('/js.php')
            .reply(200, 'Hello World!', {'X-My-Headers': 'My Header value'});

        nock(url)
            .get('/news.php')
            .reply(200, 'Hello World!', {'X-My-Headers': 'My Header value'});
    }

    function setDIRNocks() {

    }

});
