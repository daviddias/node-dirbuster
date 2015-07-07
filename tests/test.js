var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()
var nock = require('nock')
var Writable = require('stream').Writable

var experiment = lab.experiment
var test = lab.test
var before = lab.before
var after = lab.after
var expect = Code.expect

var dirBuster = require('../src/index.js')

experiment(': ', function () {
  var scope
  var url = 'http://test.url'

  before(function (done) {
    scope = nock(url)
    done()
  })

  after(function (done) {
    done()
  })

  test('GET collector', function (done) {
    var results = {}

    var out = createOutStream(results, function () {
      expect(results['/index']).to.equal(200)
      expect(results['/images']).to.equal(404)
      expect(results['/download']).to.equal(404)
      expect(results['/js']).to.equal(200)
      expect(results['/news']).to.equal(200)
      done()
    })

    setGETNocks()

    var options = {
      list: './tests/test-list.txt',
      outStream: out,
      url: url,
      methods: ['GET']
    }

    dirBuster(options)
  })

  test('POST collector', function (done) {
    var results = {}

    var out = createOutStream(results, function () {
      expect(results['/index']).to.equal(200)
      expect(results['/images']).to.equal(404)
      expect(results['/download']).to.equal(404)
      expect(results['/js']).to.equal(200)
      expect(results['/news']).to.equal(200)
      done()
    })

    setPOSTNocks()

    var options = {
      list: './tests/test-list.txt',
      outStream: out,
      url: url,
      methods: ['POST']
    }

    dirBuster(options)
  })

  test('PUT collector', function (done) {
    var results = {}

    var out = createOutStream(results, function () {
      expect(results['/index']).to.equal(200)
      expect(results['/images']).to.equal(404)
      expect(results['/download']).to.equal(404)
      expect(results['/js']).to.equal(200)
      expect(results['/news']).to.equal(200)
      done()
    })

    setPUTNocks()

    var options = {
      list: './tests/test-list.txt',
      outStream: out,
      url: url,
      methods: ['PUT']
    }

    dirBuster(options)
  })

  test('DELETE collector', function (done) {
    var results = {}

    var out = createOutStream(results, function () {
      expect(results['/index']).to.equal(200)
      expect(results['/images']).to.equal(404)
      expect(results['/download']).to.equal(404)
      expect(results['/js']).to.equal(200)
      expect(results['/news']).to.equal(200)
      done()
    })

    setDELETENocks()

    var options = {
      list: './tests/test-list.txt',
      outStream: out,
      url: url,
      methods: ['DELETE']
    }

    dirBuster(options)
  })

  test('GET with extension collector', function (done) {
    var results = {}

    var out = createOutStream(results, function () {
      expect(results['/index.php']).to.equal(200)
      expect(results['/images.php']).to.equal(404)
      expect(results['/download.php']).to.equal(404)
      expect(results['/js.php']).to.equal(200)
      expect(results['/news.php']).to.equal(200)
      done()
    })

    setGETAndExtensionNocks()

    var options = {
      list: './tests/test-list.txt',
      outStream: out,
      url: url,
      methods: ['GET'],
      extension: ['.php']
    }

    dirBuster(options)
  })

  test('Recursive DIR check', function (done) {
    var results = {}

    var out = createOutStream(results, function () {
      expect(results['/index']).to.equal(200)
      expect(results['/images']).to.equal(404)
      expect(results['/download']).to.equal(404)
      expect(results['/js']).to.equal(200)
      expect(results['/news']).to.equal(200)

      expect(results['/images/index']).to.equal(200)
      expect(results['/images/images']).to.equal(404)
      expect(results['/images/download']).to.equal(404)
      expect(results['/images/js']).to.equal(200)
      expect(results['/images/news']).to.equal(200)

      done()
    })

    setDIRNocks()

    var options = {
      list: './tests/test-list.txt',
      outStream: out,
      url: url,
      methods: ['GET'],
      depth: 1
    }

    dirBuster(options)
  })

  function createOutStream (results, cb) {
    var out = new Writable({
      decodeStrings: false,
      objMode: true
    })

    out._write = function (chunk, enc, next) {
      var result = JSON.parse(chunk.toString('utf8'))

      results[result.path] = result.statusCode
      next()
    }

    out.on('finish', cb)

    return out
  }

  function setGETNocks () {
    scope
      .get('/index')
      .reply(200)

    scope
      .get('/images')
      .reply(404)

    scope
      .get('/download')
      .reply(404)

    scope
      .get('/js')
      .reply(200)

    scope
      .get('/news')
      .reply(200)
  }

  function setPOSTNocks () {
    scope
      .post('/index')
      .reply(200)

    scope
      .post('/images')
      .reply(404)

    scope
      .post('/download')
      .reply(404)

    scope
      .post('/js')
      .reply(200)

    scope
      .post('/news')
      .reply(200)

  }

  function setPUTNocks () {
    scope
      .put('/index')
      .reply(200)

    scope
      .put('/images')
      .reply(404)

    scope
      .put('/download')
      .reply(404)

    scope
      .put('/js')
      .reply(200)

    scope
      .put('/news')
      .reply(200)

  }

  function setDELETENocks () {
    scope
      .delete('/index')
      .reply(200)

    scope
      .delete('/images')
      .reply(404)

    scope
      .delete('/download')
      .reply(404)

    scope
      .delete('/js')
      .reply(200)

    scope
      .delete('/news')
      .reply(200)

  }

  function setGETAndExtensionNocks () {
    scope
      .get('/index.php')
      .reply(200)

    scope
      .get('/images.php')
      .reply(404)

    scope
      .get('/download.php')
      .reply(404)

    scope
      .get('/js.php')
      .reply(200)

    scope
      .get('/news.php')
      .reply(200)
  }

  function setDIRNocks () {
    scope
      .get('/index')
      .reply(200)

    scope
      .get('/images')
      .reply(404)

    scope
      .get('/download')
      .reply(404)

    scope
      .get('/js')
      .reply(200)

    scope
      .get('/news')
      .reply(200)

    scope
      .head('/index/')
      .reply(404)

    scope
      .head('/images/')
      .reply(403)

    scope
      .head('/download/')
      .reply(404)

    scope
      .head('/js/')
      .reply(404)

    scope
      .head('/news/')
      .reply(404)

    scope
      .get('/images/index')
      .reply(200)

    scope
      .get('/images/images')
      .reply(404)

    scope
      .get('/images/download')
      .reply(404)

    scope
      .get('/images/js')
      .reply(200)

    scope
      .get('/images/news')
      .reply(200)

    scope
      .head('/images/index/')
      .reply(404)

    scope
      .head('/images/images/')
      .reply(404)

    scope
      .head('/images/download/')
      .reply(404)

    scope
      .head('/images/js/')
      .reply(404)

    scope
      .head('/images/news/')
      .reply(404)
  }
})
