var Transform = require('stream').Transform

function prefixer (path) {
  var ts = new Transform({
    objectMode: true
  })

  ts._transform = function (chunk, encoding, done) {
    var data = chunk.toString()
    this.push(path + '/' + data)
    done()
  }

  return ts
}

module.exports = prefixer
