var stream = require('stream')
var fs = require('fs')
var path = require('path')
var genStreams = require('../gen-streams')

function createListStream (list) {
  var ps = new stream.Transform({objectMode: true})
  ps._transform = function (data, enc, callback) {
    callback(null, data)
  }
  ps.pause()

  if (list) {
    var listStream = fs.createReadStream(
      path.resolve(process.cwd(), list))

    listStream
      .pipe(genStreams.liner())
      .pipe(genStreams.cleaner())
      .pipe(ps)
  } else {
    // pipe the fuzzer stream to the pause stream
  }

  return ps
}

module.exports = createListStream
